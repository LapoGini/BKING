import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { BookingStatus } from "@prisma/client";

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, dto: CreateBookingDto) {
    // 1. Find or create customer
    let customer = await this.prisma.customer.findFirst({
      where: {
        tenantId,
        email: dto.customer.email,
      },
    });

    if (!customer) {
      customer = await this.prisma.customer.create({
        data: {
          tenantId,
          ...dto.customer,
        },
      });
    }

    // 2. Calculate endTime if not provided
    if (!dto.endTime) {
      const services = await this.prisma.service.findMany({
        where: { id: { in: dto.serviceIds } },
      });
      const totalDuration = services.reduce((sum, s) => sum + s.duration, 0);
      dto.endTime = new Date(dto.startTime.getTime() + totalDuration * 60000);
    }

    // 3. Check for conflicts
    const conflicts = await this.prisma.booking.findMany({
      where: {
        tenantId,
        status: { not: "CANCELLED" },
        OR: [
          {
            startTime: { lte: dto.startTime },
            endTime: { gt: dto.startTime },
          },
          {
            startTime: { lt: dto.endTime },
            endTime: { gte: dto.endTime },
          },
        ],
      },
    });

    if (conflicts.length > 0) {
      throw new BadRequestException("Time slot not available");
    }

    // 4. Create booking
    const booking = await this.prisma.booking.create({
      data: {
        tenantId,
        customerId: customer.id,
        venueId: dto.venueId,
        startTime: dto.startTime,
        endTime: dto.endTime,
        partySize: dto.partySize,
        notes: dto.notes,
        status: "PENDING",
        services: {
          create: dto.serviceIds.map((serviceId) => ({ serviceId })),
        },
      },
      include: {
        customer: true,
        services: {
          include: {
            service: true,
          },
        },
      },
    });

    // TODO: Trigger webhook booking.created

    return booking;
  }

  async findOne(tenantId: string, id: string) {
    return this.prisma.booking.findFirst({
      where: { id, tenantId },
      include: {
        customer: true,
        venue: true,
        services: {
          include: { service: true },
        },
        resources: {
          include: { resource: true },
        },
      },
    });
  }

  async updateStatus(
    tenantId: string,
    id: string,
    status: string,
    userId: string,
  ) {
    const booking = await this.prisma.booking.update({
      where: { id },
      data: { status: status as BookingStatus },
    });

    // Audit log
    await this.prisma.auditLog.create({
      data: {
        tenantId,
        userId,
        action: "update",
        entity: "booking",
        entityId: id,
        changes: { status },
      },
    });

    // TODO: Trigger webhook booking.updated

    return booking;
  }
}
