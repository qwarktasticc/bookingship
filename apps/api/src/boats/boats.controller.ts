import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BoatsService } from './boats.service';
import { CreateBoatDto } from './dto';

@Controller('boats')
export class BoatsController {
  constructor(private readonly boatsService: BoatsService) {}

  @Post()
  create(@Body() dto: CreateBoatDto) {
    const mockOwnerId = 'owner-seed-id';
    return this.boatsService.create(mockOwnerId, dto);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.boatsService.getById(id);
  }
}
