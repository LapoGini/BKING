import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Headers,
  Request,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiSecurity } from "@nestjs/swagger";
import { ApiKeyGuard } from "../auth/guards/api-key.guard";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { BookingsService } from "./bookings.service";
import { CreateBookingDto } from "./dto/create-booking.dto";

interface RequestWithUser {
  user: {
    id: string;
    tenantId: string;
  };
}

@ApiTags("bookings")
@Controller("bookings")
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  @UseGuards(ApiKeyGuard)
  @ApiSecurity("api-key")
  @ApiOperation({ summary: "Create a new booking" })
  async create(
    @Headers("x-tenant-id") tenantId: string,
    @Body() createBookingDto: CreateBookingDto,
  ) {
    return this.bookingsService.create(tenantId, createBookingDto);
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get booking by ID" })
  async findOne(@Request() req: RequestWithUser, @Param("id") id: string) {
    return this.bookingsService.findOne(req.user.tenantId, id);
  }

  @Patch(":id/status")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Update booking status" })
  async updateStatus(
    @Request() req: RequestWithUser,
    @Param("id") id: string,
    @Body("status") status: string,
  ) {
    return this.bookingsService.updateStatus(
      req.user.tenantId,
      id,
      status,
      req.user.id,
    );
  }
}
