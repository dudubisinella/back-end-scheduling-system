import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  async getUserAppointments(@Query('userId') userId: string) {
    return this.appointmentsService.findByUser(userId);
  }

  @Post()
  async create(@Body() data: { userId: string; serviceId: string; dateTime: string }) {
    return this.appointmentsService.create(data);
  }
}
