import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: NotificationsGateway,
  ) {}

  async createAndEmit(userId: string, type: string, title: string, body: string) {
    const notification = await this.prisma.notification.create({
      data: { userId, type, title, body },
    });
    this.gateway.emitToUser(userId, 'notification.new', notification);
    return notification;
  }

  emitTripConfirmed(tripId: string) {
    this.gateway.emitTripEvent(tripId, { tripId, status: 'CONFIRMED' });
  }
}
