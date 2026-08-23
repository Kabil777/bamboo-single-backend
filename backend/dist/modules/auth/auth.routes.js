import { Router } from "express";
import passport from "./oauth2.strategy.js";
import { authController } from "./auth.controller.js";
import { jwkController } from "./jwk.controller.js";
import { authRequired } from "../../common/middleware/authMiddleware.js";
const router = Router();
router.get("/login/google", (req, res, next) => {
    const mode = req.query.mode;
    const state = mode === "signup" ? "signup" : "login";
    passport.authenticate("google", {
        scope: ["openid", "profile", "email"],
        state
    })(req, res, next);
});
router.get("/callback/google", passport.authenticate("google", { session: false, failureRedirect: "/login?error=auth_failed" }), authController.handleGoogleCallback);
router.post("/refresh", authController.handleRefresh);
router.post("/logout", authController.handleLogout);
router.get("/me", authRequired, authController.handleMe);
export const authRouter = router;
export const rootRouter = Router();
rootRouter.get("/oauth2/jwks", jwkController.getJwks);
//# sourceMappingURL=auth.routes.js.map