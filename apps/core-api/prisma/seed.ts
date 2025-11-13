import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Create demo tenant
  const tenant = await prisma.tenant.upsert({
    where: { domain: "demo.booking-saas.local" },
    update: {},
    create: {
      name: "Demo Restaurant",
      domain: "demo.booking-saas.local",
      settings: {
        timezone: "Europe/Rome",
        currency: "EUR",
        language: "it",
      },
    },
  });

  console.log("✅ Created tenant:", tenant.name);

  // 2. Create demo user
  const hashedPassword = await bcrypt.hash("password123", 10);
  const user = await prisma.user.upsert({
    where: { email: "admin@demo.local" },
    update: {},
    create: {
      tenantId: tenant.id,
      email: "admin@demo.local",
      password: hashedPassword,
      firstName: "Admin",
      lastName: "User",
      role: "OWNER",
    },
  });

  console.log("✅ Created user:", user.email);

  // 3. Create services
  void (await prisma.service.create({
    data: {
      tenantId: tenant.id,
      name: "Dinner Service",
      description: "Evening dinner with full menu",
      duration: 120,
      capacity: { min: 2, max: 8 },
      price: 45.0,
    },
  }));

  void (await prisma.service.create({
    data: {
      tenantId: tenant.id,
      name: "Lunch Service",
      description: "Quick business lunch",
      duration: 60,
      capacity: { min: 1, max: 6 },
      price: 25.0,
    },
  }));

  console.log("✅ Created services");

  // 4. Create venue
  void (await prisma.venue.create({
    data: {
      tenantId: tenant.id,
      name: "Main Dining Room",
      address: {
        street: "Via Roma 1",
        city: "Florence",
        postalCode: "50100",
        country: "Italy",
      },
    },
  }));

  console.log("✅ Created venue");

  // 5. Create form
  void (await prisma.form.create({
    data: {
      tenantId: tenant.id,
      name: "Restaurant Booking Form",
      schemaVersion: "1.0.0",
      schema: {
        sections: [
          { id: "datetime", label: { en: "When", it: "Quando" }, order: 0 },
          {
            id: "contact",
            label: { en: "Your Info", it: "I Tuoi Dati" },
            order: 1,
          },
        ],
        fields: [
          {
            type: "date",
            name: "date",
            label: { en: "Date", it: "Data" },
            required: true,
            section: "datetime",
          },
          {
            type: "time",
            name: "time",
            label: { en: "Time", it: "Ora" },
            required: true,
            section: "datetime",
          },
          {
            type: "email",
            name: "email",
            label: { en: "Email", it: "Email" },
            required: true,
            section: "contact",
          },
        ],
      },
    },
  }));

  console.log("✅ Created form");

  console.log("🎉 Seeding completed!");
  console.log("\nDemo credentials:");
  console.log("Email: admin@demo.local");
  console.log("Password: password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
