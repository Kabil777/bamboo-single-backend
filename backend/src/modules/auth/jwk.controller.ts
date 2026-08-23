import { Request, Response } from "express";
import { JwtHelper } from "../../lib/jwt.js";

const jwtHelper = new JwtHelper();

export class JwkController {
    public async getJwks(req: Request, res: Response) {
        try {
            const jwk = await jwtHelper.getPublicKeyJwk();
            return res.status(200).json({ keys: [jwk] });
        } catch (e) {
            console.error("Error generating JWKS", e);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

export const jwkController = new JwkController();
