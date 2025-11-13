import { Controller, Post, Body, UseGuards, Headers } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiSecurity } from "@nestjs/swagger";
import { ApiKeyGuard } from "../auth/guards/api-key.guard";
import { AvailabilityService } from "./availability.service";
import { CheckAvailabilityDto } from "./dto/check-availability.dto";

@ApiTags("availability")
@Controller("availability")
@UseGuards(ApiKeyGuard)
@ApiSecurity("api-key")
export class AvailabilityController {
  constructor(private availabilityService: AvailabilityService) {}

  @Post()
  @ApiOperation({ summary: "Check availability for booking slots" })
  async checkAvailability(
    @Headers("x-tenant-id") tenantId: string,
    @Body() body: CheckAvailabilityDto,
  ) {
    return this.availabilityService.compute({
      ...body,
      tenantId,
    });
  }
}
