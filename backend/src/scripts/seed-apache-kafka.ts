import "dotenv/config";
import { PrismaManager } from "../lib/prisma.js";
import { mediaService } from "../modules/media/media.service.js";

const prisma = PrismaManager.getClient();
const coverUrl = "https://cdn2.fptshop.com.vn/unsafe/Uploads/images/tin-tuc/180407/Originals/kafka_h%C3%ACnh%205.jpg";
const blogTitle = "Apache Kafka: A Practical Guide to Event Streaming";
const documentTitle = "Apache Kafka Documentation: Concepts and Quick Start";
const blogContent = `<h1>Apache Kafka: A Practical Guide to Event Streaming</h1><p>Apache Kafka is a distributed event streaming platform built for durable, high-throughput data pipelines. It lets teams publish events once and let many independent consumers react in real time.</p><h2>Why Kafka matters</h2><p>Traditional request-response integrations create tight coupling. Kafka turns business activity into an ordered event log, allowing analytics, notifications, search indexing, and downstream services to evolve independently.</p><h2>Core building blocks</h2><ul><li><strong>Topics</strong> organize related events.</li><li><strong>Partitions</strong> provide horizontal scale and ordering within a key.</li><li><strong>Producers</strong> publish records.</li><li><strong>Consumers</strong> read records as part of a consumer group.</li><li><strong>Brokers</strong> persist and replicate data.</li></ul><h2>Design for reliable streams</h2><p>Choose a stable message key, make consumers idempotent, define retention deliberately, and version event schemas. These decisions matter more than the first cluster configuration.</p><h2>Where to start</h2><p>Begin with one event that already matters to your product, such as <code>order.created</code>. Publish a small, documented payload, add one consumer, and measure lag before expanding the pipeline.</p>`;
const documentContent = `<h1>Apache Kafka Documentation: Concepts and Quick Start</h1><h2>Overview</h2><p>Kafka stores immutable event records in partitioned topics. Consumers track offsets, enabling replay and independent processing.</p><h2>What this guide covers</h2><p>Use the two pages in the sidebar for Kafka's architecture and the operational practices needed to run it reliably.</p><h2>Quick start checklist</h2><ol><li>Create a topic with a replication factor appropriate for your environment.</li><li>Publish a keyed event using a producer configured with acknowledgements.</li><li>Run a consumer group and monitor consumer lag.</li></ol>`;
const architectureContent = `<h1>Kafka architecture</h1><p>Kafka is a distributed commit log. Producers append records to topics, brokers persist those records, and consumers read them at their own pace.</p><h2>Topics and partitions</h2><p>A topic is divided into partitions. A partition is ordered, append-only, and assigned to a broker. The record key determines the partition, so use a stable key when ordering matters for an entity.</p><h2>Replication</h2><p>Each partition has a leader and replicas. Producers write to the leader; followers copy the log. A suitable replication factor and minimum in-sync replica setting protect data during broker failures.</p><h2>Consumer groups and offsets</h2><p>Within a consumer group, each partition is handled by at most one consumer. Kafka stores the group's committed offset, allowing a consumer to resume or deliberately replay records.</p><h2>Design checklist</h2><ul><li>Choose topic names that describe business events.</li><li>Use keys for ordering and balanced distribution.</li><li>Version schemas before changing payloads.</li><li>Make consumers idempotent because delivery can be repeated.</li></ul>`;
const operationsContent = `<h1>Operating Kafka</h1><p>Healthy Kafka operation is mostly about capacity, replication, and consumer lag. Make these visible before the first incident.</p><h2>Monitor the essentials</h2><ul><li><strong>Consumer lag:</strong> how far a group is behind the latest records.</li><li><strong>Under-replicated partitions:</strong> replicas that have fallen behind their leader.</li><li><strong>Disk usage:</strong> retention turns Kafka into a disk-capacity problem.</li><li><strong>Broker availability:</strong> controller and broker failures affect partition leadership.</li></ul><h2>Retention and replay</h2><p>Set retention to match recovery and product needs, not just the default. Before depending on replay, test resetting a consumer group in a non-production environment and verify downstream idempotency.</p><h2>Safe producer and consumer defaults</h2><p>Use acknowledgements appropriate for durability, retries with idempotence where available, and explicit commit behavior for consumers. Alert on sustained lag rather than a single short spike.</p><h2>Incident response</h2><ol><li>Identify affected topics, partitions, and consumer groups.</li><li>Check broker health and under-replicated partitions before scaling consumers.</li><li>Restore throughput, then verify offsets and downstream correctness.</li></ol>`;
const consumerPatternsContent = `<h1>Consumer patterns</h1><p>Consumer groups let multiple services process the same events independently. Within a group, Kafka assigns each partition to one consumer at a time.</p><h2>Choose the right group boundary</h2><p>Use a separate group for each independent outcome: billing, search indexing, analytics, and notifications should usually not share offsets. Scale consumers within a group only up to the topic's partition count.</p><h2>Commit safely</h2><p>Commit an offset only after the record's effect is durable. If processing can be retried, make the operation idempotent with a stable event identifier or a transactional outbox/inbox pattern.</p><h2>Handle rebalances</h2><p>Rebalances temporarily move partitions between consumers. Keep poll loops responsive, avoid long blocking work, and close consumers cleanly so ownership transfers do not cause unnecessary lag.</p><h2>Replay deliberately</h2><p>Replaying is powerful but should be an explicit operation. Reset a group's offsets in a safe environment first, understand retention limits, and ensure downstream services tolerate repeated events.</p>`;
const topicsContent = `<h1>Topics and partitions</h1><p>A topic is a named stream of records. Kafka divides it into partitions so writes and reads can scale horizontally.</p><h2>Keys preserve order</h2><p>Kafka guarantees order only inside a partition. Use a stable record key when events for the same customer, order, or device must retain their sequence.</p><h2>Plan partitions deliberately</h2><p>Partition count limits consumer parallelism. Choose enough for expected throughput, but avoid creating excessive partitions without a capacity plan.</p>`;
const replicationContent = `<h1>Replication and offsets</h1><p>Each partition has one leader and one or more followers. Producers write to the leader; followers copy its log.</p><h2>Durable writes</h2><p>Use replication and acknowledgement settings that match your failure tolerance. Monitor under-replicated partitions so a broker failure does not turn into data loss.</p><h2>Offsets</h2><p>Consumers commit offsets after durable processing. That makes restarts and replay possible, but consumers must tolerate processing a record again.</p>`;

async function main() {
    const existingDocument = await prisma.document.findFirst({
        where: { title: documentTitle },
        orderBy: { createdAt: "asc" },
        select: { id: true, authorId: true, mediaId: true },
    });
    const owner = existingDocument
        ? { id: existingDocument.authorId }
        : await prisma.user.findFirst({ where: { role: "ADMIN" }, select: { id: true } }) ?? await prisma.user.findFirst({ select: { id: true } });
    if (!owner) throw new Error("Create an admin user before seeding Apache Kafka content");

    const existingBlog = await prisma.post.findFirst({
        where: { title: blogTitle },
        orderBy: { createdAt: "asc" },
        select: { id: true, mediaId: true },
    });
    const mediaId = existingBlog?.mediaId ?? existingDocument?.mediaId;
    const media = mediaId ? { id: mediaId } : await mediaService.createFromUrl(owner.id, coverUrl);

    const blog = existingBlog
        ? await prisma.post.update({ where: { id: existingBlog.id }, data: { content: blogContent, mediaId: media.id } })
        : await prisma.post.create({ data: { title: blogTitle, content: blogContent, authorId: owner.id, mediaId: media.id } });
    const document = existingDocument
        ? await prisma.document.update({ where: { id: existingDocument.id }, data: { content: documentContent, mediaId: media.id } })
        : await prisma.document.create({ data: { title: documentTitle, content: documentContent, authorId: owner.id, mediaId: media.id } });
    const architecture = await prisma.documentPage.upsert({
            where: { documentId_position: { documentId: document.id, position: 1 } },
            create: { documentId: document.id, title: "Kafka architecture", content: architectureContent, position: 1 },
            update: { title: "Kafka architecture", content: architectureContent, parentId: null },
        });
    await Promise.all([
        prisma.documentPage.upsert({
            where: { documentId_position: { documentId: document.id, position: 2 } },
            create: { documentId: document.id, title: "Topics and partitions", content: topicsContent, position: 2, parentId: architecture.id },
            update: { title: "Topics and partitions", content: topicsContent, parentId: architecture.id },
        }),
        prisma.documentPage.upsert({
            where: { documentId_position: { documentId: document.id, position: 3 } },
            create: { documentId: document.id, title: "Replication and offsets", content: replicationContent, position: 3, parentId: architecture.id },
            update: { title: "Replication and offsets", content: replicationContent, parentId: architecture.id },
        }),
        prisma.documentPage.upsert({
            where: { documentId_position: { documentId: document.id, position: 4 } },
            create: { documentId: document.id, title: "Operating Kafka", content: operationsContent, position: 4 },
            update: { title: "Operating Kafka", content: operationsContent, parentId: null },
        }),
        prisma.documentPage.upsert({
            where: { documentId_position: { documentId: document.id, position: 5 } },
            create: { documentId: document.id, title: "Consumer patterns", content: consumerPatternsContent, position: 5 },
            update: { title: "Consumer patterns", content: consumerPatternsContent, parentId: null },
        }),
    ]);
    console.log(`Updated Apache Kafka blog ${blog.id} and document ${document.id} with three subpages.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(async () => prisma.$disconnect());
