import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { format, startOfDay, addMinutes } from 'date-fns';

const prisma = new PrismaClient();

@Injectable()
export class AvailabilityService {
  async getAvailability(serviceId: string, date: string) {
    const selectedDate = startOfDay(new Date(date));

    const service = await prisma.service.findUnique({ where: { id: serviceId }, select: { duration: true, name: true } });
    if (!service) {
      throw new Error('Serviço não encontrado.');
    }

    // Definir horário de funcionamento
    const startHour = 9; // 9:00 AM
    const endHour = 18; // 18:00 PM

    const availableSlots: { start: string; end: string }[] = [];
    let currentTime = addMinutes(selectedDate, startHour * 60);

    while (currentTime.getHours() < endHour) {
      const nextTime = addMinutes(currentTime, service.duration);

      // Verificar se o horário está livre
      const hasConflict = await prisma.appointment.findFirst({
        where: {
          serviceId,
          createdAt: {
            gte: currentTime,
            lt: nextTime,
          },
        },
      });

      if (!hasConflict) {
        availableSlots.push({
          start: format(currentTime, 'HH:mm'),
          end: format(nextTime, 'HH:mm'),
        });
      }

      currentTime = nextTime;
    }

    return {
      service: service.name,
      date: format(selectedDate, 'yyyy-MM-dd'),
      availableSlots,
    };
  }
}
