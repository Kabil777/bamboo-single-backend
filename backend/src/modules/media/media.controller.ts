import { Request, Response, NextFunction } from "express";
import { createHash } from "node:crypto";
import { mediaService } from "./media.service.js";

export class MediaController {
    createFromUrl = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const url = typeof req.query.url === "string" ? req.query.url : "";
            res.status(201).json(await mediaService.createFromUrl(req.headers["x-user-id"] as string, url));
        } catch (error) { next(error); }
    };

    create = async (req: Request, res: Response, next: NextFunction) => {
        try { res.status(201).json(await mediaService.create(req.headers["x-user-id"] as string, req.body)); } catch (error) { next(error); }
    };
    get = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const media = await mediaService.get(String(req.params.id));
            const body = Buffer.from(media.data);
            // Media assets are never updated in place: a replacement gets a new ID/URL.
            // Cache each URL aggressively while still supporting conditional requests.
            const etag = `\"${createHash("sha256").update(body).digest("base64url")}\"`;
            res.set({
                "Cache-Control": "public, max-age=31536000, immutable",
                ETag: etag,
            });

            if (req.headers["if-none-match"] === etag) {
                res.status(304).end();
                return;
            }

            res.type(media.mimeType).send(body);
        } catch (error) { next(error); }
    };
}

export const mediaController = new MediaController();
