import { PrismaManager } from "../../lib/prisma.js";
import { NotFoundError, ValidationError } from "../../common/errors.js";
import { mediaService } from "../media/media.service.js";
const prisma = PrismaManager.getClient();
export const curatedPlatforms = [
    {
        slug: "cilium",
        name: "Cilium",
        websiteUrl: "https://cilium.io/",
        coverSourceUrl: "https://cilium.io/static/b460b0d1812e1bde111b4d6b4f87bf59/1fefc/image-3.jpg",
        description: "eBPF-powered networking, observability, and security for cloud-native workloads.",
    },
    {
        slug: "kubernetes",
        name: "Kubernetes",
        websiteUrl: "https://kubernetes.io/",
        coverSourceUrl: "https://cms.cloud.vnpt.vn/uploads/Kubernetes_Service_3x_5f71db982e.png",
        description: "Open-source orchestration for deploying and managing containerized applications.",
    },
    {
        slug: "the-new-stack",
        name: "The New Stack",
        websiteUrl: "https://thenewstack.io/",
        coverSourceUrl: "https://translate.how/i/stack.webp",
        description: "News and analysis for the people building modern software infrastructure.",
    },
];
export class ReadingPlatformsService {
    async list() {
        const publicApiUrl = (process.env.PUBLIC_API_URL ?? "http://localhost:8092").replace(/\/$/, "");
        const data = await prisma.readingPlatform.findMany({ orderBy: { createdAt: "asc" } });
        return data.map((platform) => ({
            ...platform,
            coverUrl: `${publicApiUrl}/api/v1/media/${platform.coverMediaId}`,
        }));
    }
    async bootstrap(ownerId) {
        for (const platform of curatedPlatforms) {
            const existing = await prisma.readingPlatform.findUnique({ where: { slug: platform.slug } });
            if (existing) {
                await prisma.readingPlatform.update({
                    where: { slug: platform.slug },
                    data: { name: platform.name, websiteUrl: platform.websiteUrl, coverSourceUrl: platform.coverSourceUrl, description: platform.description },
                });
                continue;
            }
            const media = await mediaService.createFromUrl(ownerId, platform.coverSourceUrl);
            await prisma.readingPlatform.create({ data: { ...platform, coverMediaId: media.id } });
        }
        return this.list();
    }
    async create(ownerId, input) {
        const { name, websiteUrl, coverSourceUrl, description } = this.validateInput(input);
        const slug = this.toSlug(name);
        const existing = await prisma.readingPlatform.findUnique({ where: { slug }, select: { id: true } });
        if (existing)
            throw new ValidationError("A platform with this name already exists");
        const media = await mediaService.createFromUrl(ownerId, coverSourceUrl);
        return prisma.readingPlatform.create({
            data: { slug, name, websiteUrl, coverSourceUrl, description, coverMediaId: media.id },
        });
    }
    async remove(id) {
        const platform = await prisma.readingPlatform.findUnique({ where: { id }, select: { id: true } });
        if (!platform)
            throw new NotFoundError("Reading platform not found");
        await prisma.readingPlatform.delete({ where: { id } });
    }
    validateInput(input) {
        if (!input || typeof input !== "object" || Array.isArray(input))
            throw new ValidationError("Body must be a JSON object");
        const { name, websiteUrl, coverSourceUrl, description } = input;
        if (typeof name !== "string" || !name.trim() || name.trim().length > 100)
            throw new ValidationError("name must be a non-empty string up to 100 characters");
        if (typeof websiteUrl !== "string" || !this.isHttpUrl(websiteUrl))
            throw new ValidationError("websiteUrl must be a valid http or https URL");
        if (typeof coverSourceUrl !== "string" || !this.isHttpUrl(coverSourceUrl))
            throw new ValidationError("coverSourceUrl must be a valid http or https image URL");
        if (description !== undefined && description !== null && (typeof description !== "string" || description.length > 1000))
            throw new ValidationError("description must be at most 1000 characters");
        return { name: name.trim(), websiteUrl: websiteUrl.trim(), coverSourceUrl: coverSourceUrl.trim(), description: typeof description === "string" ? description.trim() || null : null };
    }
    isHttpUrl(value) {
        try {
            const url = new URL(value);
            return url.protocol === "http:" || url.protocol === "https:";
        }
        catch {
            return false;
        }
    }
    toSlug(name) {
        const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        if (!slug || slug.length > 50)
            throw new ValidationError("name must produce a URL-safe slug up to 50 characters");
        return slug;
    }
}
export const readingPlatformsService = new ReadingPlatformsService();
//# sourceMappingURL=reading-platforms.service.js.map