import { Injectable } from '@nestjs/common';
import { BoatType, Prisma } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';

export interface SearchQuery {
  location?: string;
  date?: string;
  people?: number;
  boatType?: BoatType;
  minPrice?: number;
  maxPrice?: number;
  captainIncluded?: boolean;
  page?: number;
  pageSize?: number;
}

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async search(query: SearchQuery) {
    const page = Math.max(query.page || 1, 1);
    const pageSize = Math.min(query.pageSize || 12, 50);

    const where: Prisma.BoatWhereInput = {
      marina: query.location ? { contains: query.location, mode: 'insensitive' } : undefined,
      boatType: query.boatType,
      capacity: query.people ? { gte: query.people } : undefined,
      captainIncluded: typeof query.captainIncluded === 'boolean' ? query.captainIncluded : undefined,
      pricePerHour: query.minPrice || query.maxPrice
        ? {
            gte: query.minPrice ? new Prisma.Decimal(query.minPrice) : undefined,
            lte: query.maxPrice ? new Prisma.Decimal(query.maxPrice) : undefined,
          }
        : undefined,
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.boat.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.boat.count({ where }),
    ]);

    return { items, total, page, pageSize, pages: Math.ceil(total / pageSize) };
  }
}
