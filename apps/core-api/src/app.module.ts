import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { TenantsModule } from "./tenants/tenants.module";
import { ServicesModule } from "./services/services.module";
import { VenuesModule } from "./venues/venues.module";
import { ResourcesModule } from "./resources/resources.module";
import { FormsModule } from "./forms/forms.module";
import { BookingsModule } from "./bookings/bookings.module";
import { CustomersModule } from "./customers/customers.module";
import { AvailabilityModule } from "./availability/availability.module";
import { PushModule } from "./push/push.module";
import { CalendarModule } from "./calendar/calendar.module";
import { WebhooksModule } from "./webhooks/webhooks.module";
import { AuditModule } from "./audit/audit.module";
import { ConfigController } from "./config/config.controller";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 10, // 10 requests per minute default
      },
    ]),
    PrismaModule,
    AuthModule,
    TenantsModule,
    ServicesModule,
    VenuesModule,
    ResourcesModule,
    FormsModule,
    BookingsModule,
    CustomersModule,
    AvailabilityModule,
    PushModule,
    CalendarModule,
    WebhooksModule,
    AuditModule,
  ],
  controllers: [ConfigController],
})
export class AppModule {}
