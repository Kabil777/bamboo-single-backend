import "dotenv/config";
import { PrismaManager } from "../lib/prisma.js";
import { readingPlatformsService } from "../modules/reading-platforms/reading-platforms.service.js";

const prisma = PrismaManager.getClient();

async function main() {
    const owner = await prisma.user.findFirst({
        where: { role: "ADMIN" },
        select: { id: true },
    }) ?? await prisma.user.findFirst({ select: { id: true } });

    if (!owner) throw new Error("Create an admin user before seeding reading platforms");
    const platforms = await readingPlatformsService.bootstrap(owner.id);
    console.log(`Stored ${platforms.length} reading platforms in PostgreSQL.`);
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(async () => prisma.$disconnect());
