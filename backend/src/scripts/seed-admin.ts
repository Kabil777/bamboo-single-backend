import "dotenv/config";
import { PrismaManager } from "../lib/prisma.js";

const prisma = PrismaManager.getClient();

async function main() {
    const adminEmail = (process.env.ADMIN_EMAIL || "admin@bamboo.local").trim().toLowerCase();
    
    const existingAdmin = await prisma.user.findFirst({
        where: { role: "ADMIN" }
    });

    if (existingAdmin) {
        console.log(`Admin user already exists (${existingAdmin.email}, ID: ${existingAdmin.id})`);
        return;
    }

    const admin = await prisma.user.upsert({
        where: { email_providerId: { email: adminEmail, providerId: "local-admin" } },
        update: { role: "ADMIN" },
        create: {
            name: "Bamboo Admin",
            email: adminEmail,
            provider: "local",
            providerId: "local-admin",
            role: "ADMIN"
        }
    });

    console.log(`Created default admin user: ${admin.email} (ID: ${admin.id})`);
}

main()
    .catch((err) => {
        console.error("Admin seeding error:", err);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
