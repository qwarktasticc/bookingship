import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('boats')
  list(@Query() query: Record<string, string>) {
    return this.searchService.search({
      ...query,
      people: query.people ? Number(query.people) : undefined,
      minPrice: query.minPrice ? Number(query.minPrice) : undefined,
      maxPrice: query.maxPrice ? Number(query.maxPrice) : undefined,
      captainIncluded: query.captainIncluded ? query.captainIncluded === 'true' : undefined,
      page: query.page ? Number(query.page) : 1,
      pageSize: query.pageSize ? Number(query.pageSize) : 12,
    });
  }
}
