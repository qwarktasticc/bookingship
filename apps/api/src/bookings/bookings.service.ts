import { BadRequestException, Injectable } from '@nestjs/common';
import { BookingStatus, BookingType, Prisma, TripStatus } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PaymentsService } from '../payments/payments.service';
import { CreateBookingDto } from './dto';

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
    private readonly payments: PaymentsService,
  ) {}

  async createBooking(userId: string, dto: CreateBookingDto) {
    const startTime = new Date(dto.startTime);
    const endTime = new Date(dto.endTime);

    return this.prisma.$transaction(async (tx) => {
      const boat = await tx.boat.findUnique({ where: { id: dto.boatId } });
      if (!boat) throw new BadRequestException('Boat not found');

      const overlappingFull = await tx.trip.findFirst({
        where: {
          boatId: dto.boatId,
          status: { in: [TripStatus.OPEN, TripStatus.CONFIRMED] },
          startTime: { lt: endTime },
          endTime: { gt: startTime },
        },
      });

      const trip =
        overlappingFull ||
        (await tx.trip.create({
          data: {
            boatId: dto.boatId,
            startTime,
            endTime,
            seatCapacity: boat.capacity,
            status: TripStatus.OPEN,
          },
        }));

      if (trip.status === TripStatus.CONFIRMED && dto.bookingType === BookingType.SEAT) {
        throw new BadRequestException('Trip already confirmed and closed');
      }

      const seatsRequested = dto.bookingType === BookingType.FULL_CHARTER ? trip.seatCapacity : dto.seats;
      const projectedSeats = trip.bookedSeats + seatsRequested;

      if (projectedSeats > trip.seatCapacity) {
        throw new BadRequestException('Not enough seats available');
      }

      if (dto.bookingType === BookingType.FULL_CHARTER && trip.bookedSeats > 0) {
        throw new BadRequestException('Cannot full-charter a partially booked trip');
      }

      const basePrice = dto.bookingType === BookingType.FULL_CHARTER
        ? Number(boat.pricePerHour)
        : Number(boat.pricePerSeat) * seatsRequested;
      const deposit = Math.round(basePrice * 0.2 * 100);
      const paymentIntent = await this.payments.createPaymentIntent(deposit, {
        tripId: trip.id,
        userId,
        bookingType: dto.bookingType,
      });

      const booking = await tx.booking.create({
        data: {
          userId,
          tripId: trip.id,
          bookingType: dto.bookingType,
          seatsReserved: seatsRequested,
          amount: new Prisma.Decimal(basePrice),
          depositAmount: new Prisma.Decimal(basePrice * 0.2),
          status: BookingStatus.CONFIRMED,
          stripePaymentIntent: paymentIntent.id,
        },
      });

      const updatedTrip = await tx.trip.update({
        where: { id: trip.id },
        data: {
          bookedSeats: { increment: seatsRequested },
          status: projectedSeats >= trip.seatCapacity ? TripStatus.CONFIRMED : TripStatus.OPEN,
        },
        include: { bookings: true },
      });

      await this.notifications.createAndEmit(
        userId,
        'BOOKING_CONFIRMED',
        'Booking confirmed',
        `Your booking on ${boat.title} is confirmed.`,
      );

      if (updatedTrip.status === TripStatus.CONFIRMED) {
        await Promise.all(
          updatedTrip.bookings.map((tripBooking) =>
            this.notifications.createAndEmit(
              tripBooking.userId,
              'TRIP_CONFIRMED',
              'Trip confirmed',
              'Great news! All seats are filled and your trip is now confirmed.',
            ),
          ),
        );
        this.notifications.emitTripConfirmed(updatedTrip.id);
      }

      return booking;
    });
  }
}
