import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';
import { CreateBoatDto } from './dto';

@Injectable()
export class BoatsService {
  constructor(private readonly prisma: PrismaService) {}

  create(ownerId: string, dto: CreateBoatDto) {
    return this.prisma.boat.create({
      data: {
        ...dto,
        ownerId,
        pricePerHour: new Prisma.Decimal(dto.pricePerHour),
        pricePerSeat: new Prisma.Decimal(dto.pricePerSeat),
      },
    });
  }

  getById(id: string) {
    return this.prisma.boat.findUnique({
      where: { id },
      include: {
        reviews: true,
        trips: {
          where: { startTime: { gte: new Date() } },
          orderBy: { startTime: 'asc' },
          take: 20,
        },
      },
    });
  }
}
