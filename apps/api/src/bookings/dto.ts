import { BookingType } from '@prisma/client';
import { IsDateString, IsEnum, IsInt, IsString, Max, Min } from 'class-validator';

export class CreateBookingDto {
  @IsString() boatId!: string;
  @IsDateString() startTime!: string;
  @IsDateString() endTime!: string;
  @IsEnum(BookingType) bookingType!: BookingType;
  @IsInt() @Min(1) @Max(200) seats!: number;
}
