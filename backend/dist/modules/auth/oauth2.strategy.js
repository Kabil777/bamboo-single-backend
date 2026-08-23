import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import "dotenv/config";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "stub-client-id";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "stub-secret";
const CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || "http://localhost:8092/api/v1/auth/callback/google";
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
    try {
        const oauthProfile = {
            provider: "GOOGLE",
            providerId: profile.id,
            email: profile.emails?.[0]?.value || "",
            name: profile.displayName || "",
            picture: profile.photos?.[0]?.value
        };
        return done(null, oauthProfile);
    }
    catch (e) {
        return done(e);
    }
}));
export default passport;
//# sourceMappingURL=oauth2.strategy.js.map