import { Controller, Get, UseGuards, Headers } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiSecurity } from "@nestjs/swagger";
import { ApiKeyGuard } from "../auth/guards/api-key.guard";
import { PrismaService } from "../prisma/prisma.service";

@ApiTags("config")
@Controller("config")
@UseGuards(ApiKeyGuard)
@ApiSecurity("api-key")
export class ConfigController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: "Get widget configuration for tenant" })
  async getConfig(@Headers("x-tenant-id") tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    const services = await this.prisma.service.findMany({
      where: { tenantId, active: true },
    });

    const forms = await this.prisma.form.findMany({
      where: { tenantId, active: true },
    });

    return {
      tenant,
      services,
      form: forms[0], // Default form
    };
  }
}
