import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class ServicesService {
  async findAll() {
    return prisma.service.findMany();
  }

  async create(data: { name: string; duration: number; price: number }) {
    return prisma.service.create({ data });
  }
}
