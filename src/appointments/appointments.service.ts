import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { isBefore } from 'date-fns';

const prisma = new PrismaClient();

@Injectable()
export class AppointmentsService {
  async findByUser(userId: string) {
    return prisma.appointment.findMany({
      where: { userId },
      include: { service: true },
    });
  }

  async create(data: { userId: string; serviceId: string; dateTime: string }) {
    const { userId, serviceId, dateTime } = data;
    const appointmentDate = new Date(dateTime);

    // Verifica se a data é passada
    if (isBefore(appointmentDate, new Date())) {
      throw new BadRequestException('Não é possível agendar para um horário passado.');
    }

    // Buscar serviço e duração
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) {
      throw new BadRequestException('Serviço não encontrado.');
    }

    // Verificar conflito de horários
    const conflicts = await prisma.appointment.findMany({
      where: {
        serviceId,
        createdAt: {
          gte: appointmentDate,
          lt: new Date(appointmentDate.getTime() + service.duration * 60000),
        },
      },
    });

    if (conflicts.length > 0) {
      throw new BadRequestException('Horário já ocupado.');
    }

    // Criar agendamento
    return prisma.appointment.create({
      data: { userId, serviceId, createdAt: appointmentDate },
    });
  }
}
