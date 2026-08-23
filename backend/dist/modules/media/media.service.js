import { PrismaManager } from "../../lib/prisma.js";
import { NotFoundError, ValidationError } from "../../common/errors.js";
const prisma = PrismaManager.getClient();
const MAX_MEDIA_BYTES = 8 * 1024 * 1024;
export class MediaService {
    async createFromUrl(ownerId, sourceUrl) {
        let url;
        try {
            url = new URL(sourceUrl);
        }
        catch {
            throw new ValidationError("url must be valid");
        }
        if (url.protocol !== "https:" && url.protocol !== "http:")
            throw new ValidationError("url must use http or https");
        const response = await fetch(url, { signal: AbortSignal.timeout(15_000) });
        if (!response.ok)
            throw new ValidationError("Could not download media URL");
        const mimeType = response.headers.get("content-type")?.split(";")[0] ?? "";
        if (!mimeType.startsWith("image/"))
            throw new ValidationError("URL must point to an image");
        const declaredSize = Number(response.headers.get("content-length") ?? 0);
        if (declaredSize > MAX_MEDIA_BYTES)
            throw new ValidationError("media must be at most 8 MiB");
        const data = Buffer.from(await response.arrayBuffer());
        if (!data.length || data.length > MAX_MEDIA_BYTES)
            throw new ValidationError("media must be between 1 byte and 8 MiB");
        const filename = url.pathname.split("/").filter(Boolean).at(-1) || undefined;
        return prisma.mediaAsset.create({ data: { data, mimeType, filename, ownerId }, select: { id: true, mimeType: true, filename: true, createdAt: true } });
    }
    async create(ownerId, input) {
        if (!input || typeof input !== "object" || Array.isArray(input))
            throw new ValidationError("Body must be a JSON object");
        const { base64, mimeType, filename } = input;
        if (typeof base64 !== "string" || typeof mimeType !== "string" || !mimeType)
            throw new ValidationError("base64 and mimeType are required");
        if (filename !== undefined && typeof filename !== "string")
            throw new ValidationError("filename must be a string");
        const normalized = base64.replace(/^data:[^;]+;base64,/, "");
        if (!/^[A-Za-z0-9+/]*={0,2}$/.test(normalized) || normalized.length % 4 !== 0)
            throw new ValidationError("base64 is invalid");
        const data = Buffer.from(normalized, "base64");
        if (!data.length || data.length > MAX_MEDIA_BYTES)
            throw new ValidationError("media must be between 1 byte and 8 MiB");
        return prisma.mediaAsset.create({ data: { data, mimeType, filename: filename, ownerId }, select: { id: true, mimeType: true, filename: true, createdAt: true } });
    }
    async get(id) {
        const media = await prisma.mediaAsset.findUnique({ where: { id } });
        if (!media)
            throw new NotFoundError("Media not found");
        return media;
    }
}
export const mediaService = new MediaService();
//# sourceMappingURL=media.service.js.map