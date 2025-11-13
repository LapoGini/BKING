import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

interface AvailabilityRequest {
  date: string; // YYYY-MM-DD
  timeRange?: { start: string; end: string }; // HH:mm
  serviceIds: string[];
  venueId?: string;
  partySize?: number;
  tenantId: string;
}

interface Slot {
  start: Date;
  end: Date;
  status: "free" | "waitlist" | "full";
  reason?: string;
  resourceIds?: string[];
  price?: number;
}

@Injectable()
export class AvailabilityService {
  constructor(private prisma: PrismaService) {}

  /**
   * Single engine handling both classic and multi-service bookings
   */
  async compute(req: AvailabilityRequest): Promise<{ slots: Slot[] }> {
    // 1. Get tenant timezone
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: req.tenantId },
    });
    const tz = (tenant?.settings as { timezone?: string })?.timezone || "UTC";

    // 2. Get services
    const services = await this.prisma.service.findMany({
      where: {
        id: { in: req.serviceIds },
        tenantId: req.tenantId,
        active: true,
      },
    });

    if (services.length === 0) {
      return { slots: [] };
    }

    // 3. Calculate total duration
    const totalDuration = services.reduce((sum, s) => sum + s.duration, 0);

    // 4. Generate time slots (30min intervals)
    const slots = this.generateTimeSlots(
      req.date,
      req.timeRange,
      totalDuration,
      tz,
    );

    // 5. Check existing bookings for conflicts
    const existingBookings = await this.prisma.booking.findMany({
      where: {
        tenantId: req.tenantId,
        startTime: {
          gte: dayjs(req.date).startOf("day").toDate(),
          lte: dayjs(req.date).endOf("day").toDate(),
        },
        status: {
          not: "CANCELLED",
        },
      },
      include: {
        resources: true,
      },
    });

    // 6. Mark slots as free/full based on conflicts
    const availableSlots = slots.map((slot) => {
      const hasConflict = existingBookings.some((booking) =>
        this.hasTimeOverlap(
          slot.start,
          slot.end,
          booking.startTime,
          booking.endTime,
        ),
      );

      return {
        ...slot,
        status: hasConflict ? "full" : "free",
        reason: hasConflict ? "Slot already booked" : undefined,
      } as Slot;
    });

    return { slots: availableSlots };
  }

  private generateTimeSlots(
    date: string,
    timeRange: { start: string; end: string } | undefined,
    duration: number,
    tz: string,
  ): Slot[] {
    const slots: Slot[] = [];
    const baseDate = dayjs.tz(date, tz);

    const startHour = timeRange?.start
      ? parseInt(timeRange.start.split(":")[0])
      : 9;
    const endHour = timeRange?.end ? parseInt(timeRange.end.split(":")[0]) : 22;

    for (let hour = startHour; hour < endHour; hour++) {
      for (const minute of [0, 30]) {
        const start = baseDate.hour(hour).minute(minute).second(0);
        const end = start.add(duration, "minute");

        if (end.hour() <= endHour) {
          slots.push({
            start: start.toDate(),
            end: end.toDate(),
            status: "free",
          });
        }
      }
    }

    return slots;
  }

  private hasTimeOverlap(
    start1: Date,
    end1: Date,
    start2: Date,
    end2: Date,
  ): boolean {
    return start1 < end2 && end1 > start2;
  }
}
