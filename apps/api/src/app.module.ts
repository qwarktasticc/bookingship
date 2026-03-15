import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './common/prisma.service';
import { BoatsModule } from './boats/boats.module';
import { BookingsModule } from './bookings/bookings.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PaymentsModule } from './payments/payments.module';
import { ReviewsModule } from './reviews/reviews.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BoatsModule,
    BookingsModule,
    NotificationsModule,
    PaymentsModule,
    ReviewsModule,
    SearchModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
