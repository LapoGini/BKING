import { Controller, Get, Param, Res } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { Response } from "express";
import ical from "ical-generator";
import { PrismaService } from "../prisma/prisma.service";

@ApiTags("calendar")
@Controller("cal")
export class CalendarController {
  constructor(private prisma: PrismaService) {}

  @Get("venue/:id.ics")
  @ApiOperation({ summary: "Get iCal feed for venue bookings" })
  async getVenueCalendar(@Param("id") venueId: string, @Res() res: Response) {
    const bookings = await this.prisma.booking.findMany({
      where: { venueId },
      include: { customer: true, services: { include: { service: true } } },
    });

    const calendar = ical({ name: "Venue Bookings" });

    bookings.forEach((booking) => {
      calendar.createEvent({
        start: booking.startTime,
        end: booking.endTime,
        summary: `Booking - ${booking.customer.firstName} (${booking.partySize} people)`,
        description: booking.notes || "",
      });
    });

    res.type("text/calendar").send(calendar.toString());
  }
}
