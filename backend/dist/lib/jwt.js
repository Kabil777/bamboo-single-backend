import { parse as parseCookie } from "cookie";
import { jwtVerify, SignJWT, importSPKI, importPKCS8, exportJWK } from "jose";
import * as fs from "node:fs";
import * as path from "node:path";
import * as crypto from "node:crypto";
const PRIVATE_KEY_PATH = path.resolve(process.cwd(), process.env.JWT_PRIVATE_KEY_PATH ?? "./keys/private.pem");
const PUBLIC_KEY_PATH = path.resolve(process.cwd(), process.env.JWT_PUBLIC_KEY_PATH ?? "./keys/public.pem");
const KEYS_DIR = path.dirname(PRIVATE_KEY_PATH);
if (!fs.existsSync(KEYS_DIR)) {
    fs.mkdirSync(KEYS_DIR, { recursive: true });
}
if (!fs.existsSync(PRIVATE_KEY_PATH) || !fs.existsSync(PUBLIC_KEY_PATH)) {
    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: { type: "spki", format: "pem" },
        privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });
    fs.writeFileSync(PRIVATE_KEY_PATH, privateKey);
    fs.writeFileSync(PUBLIC_KEY_PATH, publicKey);
}
const privateKeyPem = fs.readFileSync(PRIVATE_KEY_PATH, "utf-8");
const publicKeyPem = fs.readFileSync(PUBLIC_KEY_PATH, "utf-8");
let privateKeyObj;
let publicKeyObj;
let jwkObj;
(async () => {
    privateKeyObj = await importPKCS8(privateKeyPem, "RS256");
    publicKeyObj = await importSPKI(publicKeyPem, "RS256");
    jwkObj = await exportJWK(publicKeyObj);
    jwkObj.kid = "auth-key-1";
    jwkObj.use = "sig";
    jwkObj.alg = "RS256";
})();
export class JwtHelper {
    async verifyAccessToken(token) {
        if (!publicKeyObj)
            publicKeyObj = await importSPKI(publicKeyPem, "RS256");
        const { payload } = await jwtVerify(token, publicKeyObj, {
            algorithms: ["RS256"],
            clockTolerance: "5s",
        });
        return payload;
    }
    parseJwtFromRequest(request) {
        const header = request.headers.authorization;
        if (typeof header === "string" && header.startsWith("Bearer ")) {
            const token = header.slice(7).trim();
            if (token)
                return token;
        }
        const cookieHeader = request.headers.cookie;
        if (!cookieHeader)
            return null;
        return parseCookie(cookieHeader).ac_token ?? null;
    }
    async getPublicKeyJwk() {
        if (!jwkObj) {
            if (!publicKeyObj)
                publicKeyObj = await importSPKI(publicKeyPem, "RS256");
            jwkObj = await exportJWK(publicKeyObj);
            jwkObj.kid = "auth-key-1";
            jwkObj.use = "sig";
            jwkObj.alg = "RS256";
        }
        return jwkObj;
    }
    async signAccessToken(payload, expiresIn) {
        if (!privateKeyObj)
            privateKeyObj = await importPKCS8(privateKeyPem, "RS256");
        return new SignJWT(payload)
            .setProtectedHeader({ alg: "RS256", typ: "JWT", kid: "auth-key-1" })
            .setIssuer("admin@bammooCorp")
            .setIssuedAt()
            .setExpirationTime(expiresIn)
            .sign(privateKeyObj);
    }
}
//# sourceMappingURL=jwt.js.map