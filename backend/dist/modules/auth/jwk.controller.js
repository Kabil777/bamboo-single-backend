import { JwtHelper } from "../../lib/jwt.js";
const jwtHelper = new JwtHelper();
export class JwkController {
    async getJwks(req, res) {
        try {
            const jwk = await jwtHelper.getPublicKeyJwk();
            return res.status(200).json({ keys: [jwk] });
        }
        catch (e) {
            console.error("Error generating JWKS", e);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}
export const jwkController = new JwkController();
//# sourceMappingURL=jwk.controller.js.map