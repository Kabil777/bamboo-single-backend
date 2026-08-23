import "dotenv/config";
import { PrismaManager } from "../lib/prisma.js";
import { mediaService } from "../modules/media/media.service.js";
const prisma = PrismaManager.getClient();
const specs = [
    {
        name: "Apache Spark",
        blogTitle: "Apache Spark: Distributed Data Processing in Practice",
        documentTitle: "Apache Spark Documentation: Foundations and Operations",
        coverUrl: "https://www.databricks.com/sites/default/files/2023-03/largest-open-source-apache-spark.png?v=1679038543",
        summary: "Apache Spark is a distributed compute engine for batch processing, SQL, streaming, and machine-learning workloads. It lets teams express data work with high-level APIs while executing it across a cluster.",
        architecture: "Spark applications have a driver that plans work and executors that run tasks across a cluster. A cluster manager allocates resources, while stages and tasks divide a job into parallel units.",
        fundamentals: "DataFrames provide an optimized, structured API. Transformations describe work lazily; actions trigger execution. Partitioning, joins, and shuffles determine most real-world performance characteristics.",
        quickStart: "Start with a small DataFrame pipeline, inspect the physical plan, and persist only data reused by multiple actions. Keep schemas explicit and measure shuffle-heavy operations before scaling the cluster.",
        operations: "Monitor executor memory, shuffle spill, task skew, and failed stages. Set sensible partition counts, avoid collecting large datasets to the driver, and use checkpointing for long-running streaming jobs.",
    },
    {
        name: "Apache Iceberg",
        blogTitle: "Apache Iceberg: Reliable Tables for Modern Data Lakes",
        documentTitle: "Apache Iceberg Documentation: Table Design and Operations",
        coverUrl: "https://estuary.dev/static/e300a58eb82dc1afc1675ccb7ba5a668/afc0e/Image_3_3d0bd564d6.png",
        summary: "Apache Iceberg is an open table format for large analytic datasets. It brings reliable snapshots, schema evolution, hidden partitioning, and atomic commits to object-storage data lakes.",
        architecture: "An Iceberg table stores data files alongside metadata files and immutable snapshots. Catalogs track the current metadata location, allowing engines to plan reads consistently and writers to commit atomically.",
        fundamentals: "Snapshots make reads repeatable and enable time travel. Schema and partition evolution avoid expensive rewrites, while manifests let engines skip files that cannot match a query.",
        quickStart: "Create a table through a supported catalog, write a small batch, then inspect snapshots and partition statistics. Choose partition transforms based on query patterns instead of exposing physical paths to users.",
        operations: "Schedule metadata cleanup, expire old snapshots according to recovery needs, compact small files, and monitor commit failures. Test concurrent writes and rollback procedures before production adoption.",
    },
    {
        name: "PostgreSQL",
        blogTitle: "PostgreSQL: The Database Built for Durable Systems",
        documentTitle: "PostgreSQL Documentation: Data Modeling and Operations",
        coverUrl: "https://www.tigerdata.com/_next/image?url=https%3A%2F%2Fstorage.ghost.io%2Fc%2F6b%2Fcb%2F6bcb39cf-9421-4bd1-9c9d-fa7b6755ba0e%2Fcontent%2Fimages%2F2024%2F06%2FPostgres-for-Everything_databases.png&w=3840&q=100",
        summary: "PostgreSQL is a relational database known for correctness, extensibility, and powerful SQL. It is a strong default for transactional applications as well as many analytical and search-adjacent workloads.",
        architecture: "PostgreSQL stores relations in heap files and uses write-ahead logging for crash recovery. Its MVCC model gives readers consistent snapshots while concurrent writers create new row versions.",
        fundamentals: "Start with clear relational modeling, constraints, and indexes that follow real query paths. Use transactions for related changes and inspect query plans before guessing about performance.",
        quickStart: "Create a small schema with primary keys and foreign keys, load representative data, then run EXPLAIN ANALYZE on the queries your application actually issues. Add indexes only when the plan supports them.",
        operations: "Watch connection counts, slow queries, autovacuum activity, replication lag, and disk growth. Take tested backups, rehearse restores, and keep migrations backward-compatible during deployment.",
    },
];
const html = (title, body) => `<h1>${title}</h1><p>${body}</p>`;
async function seed(spec) {
    const existingDocument = await prisma.document.findFirst({ where: { title: spec.documentTitle }, orderBy: { createdAt: "asc" }, select: { id: true, authorId: true, mediaId: true } });
    const owner = existingDocument
        ? { id: existingDocument.authorId }
        : await prisma.user.findFirst({ where: { role: "ADMIN" }, select: { id: true } }) ?? await prisma.user.findFirst({ select: { id: true } });
    if (!owner)
        throw new Error("Create a user before seeding content");
    const existingBlog = await prisma.post.findFirst({ where: { title: spec.blogTitle }, orderBy: { createdAt: "asc" }, select: { id: true, mediaId: true } });
    const mediaId = existingBlog?.mediaId ?? existingDocument?.mediaId;
    const media = mediaId ? { id: mediaId } : await mediaService.createFromUrl(owner.id, spec.coverUrl);
    const blog = existingBlog
        ? await prisma.post.update({ where: { id: existingBlog.id }, data: { content: html(spec.blogTitle, spec.summary), mediaId: media.id } })
        : await prisma.post.create({ data: { title: spec.blogTitle, content: html(spec.blogTitle, spec.summary), authorId: owner.id, mediaId: media.id } });
    const document = existingDocument
        ? await prisma.document.update({ where: { id: existingDocument.id }, data: { content: html(spec.documentTitle, spec.summary), mediaId: media.id } })
        : await prisma.document.create({ data: { title: spec.documentTitle, content: html(spec.documentTitle, spec.summary), authorId: owner.id, mediaId: media.id } });
    const chapter = await prisma.documentPage.upsert({
        where: { documentId_position: { documentId: document.id, position: 1 } },
        create: { documentId: document.id, title: `${spec.name} architecture`, content: html(`${spec.name} architecture`, spec.architecture), position: 1 },
        update: { title: `${spec.name} architecture`, content: html(`${spec.name} architecture`, spec.architecture), parentId: null },
    });
    await Promise.all([
        prisma.documentPage.upsert({ where: { documentId_position: { documentId: document.id, position: 2 } }, create: { documentId: document.id, parentId: chapter.id, title: "Core concepts", content: html("Core concepts", spec.fundamentals), position: 2 }, update: { parentId: chapter.id, title: "Core concepts", content: html("Core concepts", spec.fundamentals) } }),
        prisma.documentPage.upsert({ where: { documentId_position: { documentId: document.id, position: 3 } }, create: { documentId: document.id, parentId: chapter.id, title: "Quick start", content: html("Quick start", spec.quickStart), position: 3 }, update: { parentId: chapter.id, title: "Quick start", content: html("Quick start", spec.quickStart) } }),
        prisma.documentPage.upsert({ where: { documentId_position: { documentId: document.id, position: 4 } }, create: { documentId: document.id, title: "Operations", content: html("Operations", spec.operations), position: 4 }, update: { parentId: null, title: "Operations", content: html("Operations", spec.operations) } }),
    ]);
    console.log(`Seeded ${spec.name}: blog ${blog.id}, document ${document.id}.`);
}
Promise.all(specs.map(seed))
    .catch((error) => { console.error(error); process.exitCode = 1; })
    .finally(async () => prisma.$disconnect());
//# sourceMappingURL=seed-data-platform-content.js.map