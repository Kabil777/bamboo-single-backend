import { lookup } from "node:dns/promises";
import { Router } from "express";
import { ValidationError } from "../../common/errors.js";

type Preview = {
    sourceUrl: string;
    title: string | null;
    description: string | null;
    image: string | null;
};

const MAX_HTML_BYTES = 1_000_000;

function metaContent(html: string, key: string) {
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const first = new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i");
    const second = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escaped}["'][^>]*>`, "i");
    return (first.exec(html)?.[1] ?? second.exec(html)?.[1] ?? null)?.replace(/&amp;/g, "&");
}

function isPrivateIp(address: string) {
    return address === "::1" || address === "::" || address.startsWith("127.") || address.startsWith("10.") ||
        address.startsWith("192.168.") || /^172\.(1[6-9]|2\d|3[01])\./.test(address) ||
        address.toLowerCase().startsWith("fc") || address.toLowerCase().startsWith("fd") || address.toLowerCase().startsWith("fe80:");
}

async function safeUrl(value: string) {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") throw new ValidationError("Only HTTP(S) URLs are supported");
    const addresses = await lookup(url.hostname, { all: true });
    if (!addresses.length || addresses.some(({ address }) => isPrivateIp(address))) throw new ValidationError("Local URLs are not allowed");
    return url;
}

async function preview(sourceUrl: string): Promise<Preview> {
    try {
        let url = await safeUrl(sourceUrl);
        let response: Response | undefined;
        for (let redirects = 0; redirects < 4; redirects += 1) {
            response = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(8_000), headers: { "user-agent": "BambooBlogPreview/1.0" } });
            if (response.status < 300 || response.status >= 400) break;
            const location = response.headers.get("location");
            if (!location) break;
            url = await safeUrl(new URL(location, url).toString());
        }
        if (!response?.ok || !response.headers.get("content-type")?.includes("text/html")) return { sourceUrl, title: null, description: null, image: null };
        if (Number(response.headers.get("content-length") ?? 0) > MAX_HTML_BYTES) return { sourceUrl, title: null, description: null, image: null };
        const html = (await response.text()).slice(0, MAX_HTML_BYTES);
        const image = metaContent(html, "og:image");
        return {
            sourceUrl,
            title: metaContent(html, "og:title") ?? html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() ?? null,
            description: metaContent(html, "og:description") ?? metaContent(html, "description") ?? null,
            image: image ? new URL(image, url).toString() : null,
        };
    } catch {
        return { sourceUrl, title: null, description: null, image: null };
    }
}

const router = Router();

router.post("/", async (req, res, next) => {
    try {
        const urls = req.body?.urls;
        if (!Array.isArray(urls) || urls.length < 1 || urls.length > 3 || urls.some((url) => typeof url !== "string")) {
            throw new ValidationError("urls must contain one to three website links");
        }
        res.json({ data: await Promise.all(urls.map(preview)) });
    } catch (error) { next(error); }
});

export default router;
