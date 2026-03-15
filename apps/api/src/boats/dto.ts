import { BoatType } from '@prisma/client';
import { IsArray, IsBoolean, IsEnum, IsInt, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateBoatDto {
  @IsString() title!: string;
  @IsString() description!: string;
  @IsEnum(BoatType) boatType!: BoatType;
  @IsInt() @Min(1) @Max(500) capacity!: number;
  @IsNumber() pricePerHour!: number;
  @IsNumber() pricePerSeat!: number;
  @IsString() marina!: string;
  @IsArray() amenities!: string[];
  @IsArray() photos!: string[];
  @IsBoolean() captainIncluded!: boolean;
}
