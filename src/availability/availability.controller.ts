import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { AvailabilityService } from './availability.service';

@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get()
  async getAvailability(
    @Query('serviceId') serviceId: string,
    @Query('date') date: string,
  ) {
    if (!serviceId || !date) {
      throw new BadRequestException('serviceId e date são obrigatórios');
    }

    return this.availabilityService.getAvailability(serviceId, date);
  }
}
