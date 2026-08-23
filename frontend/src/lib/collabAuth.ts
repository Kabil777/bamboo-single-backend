import { authApi } from "@/api/authApi";
import { getAuthentication, logout } from "@/store/reducers/AuthReducers";
import store from "@/store/store";

let inflightRefresh: Promise<void> | null = null;

function isRecoverableAuthSignal(code?: number, reason?: string) {
    return (
        code === 4401 ||
        reason === "TOKEN_EXPIRED" ||
        reason === "INVALID_TOKEN" ||
        reason === "MISSING_TOKEN" ||
        reason === "UNAUTHORIZED"
    );
}

function isForbiddenSignal(code?: number, reason?: string) {
    return code === 4403 || reason === "FORBIDDEN";
}

export function shouldRefreshWsAuth(code?: number, reason?: string) {
    return isRecoverableAuthSignal(code, reason);
}

export function isWsForbidden(code?: number, reason?: string) {
    return isForbiddenSignal(code, reason);
}

export function refreshSessionForCollab() {
    if (!inflightRefresh) {
        const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || "";
        const normalizedVersion = apiVersion
            ? `/${apiVersion.replace(/^\/+|\/+$/g, "")}`
            : "";
        const url = `${normalizedVersion}/auth/refresh`;

        inflightRefresh = authApi.post(url).then(async () => {
            const authResult = await store.dispatch(getAuthentication());
            if (getAuthentication.rejected.match(authResult)) {
                store.dispatch(logout());
                throw new Error("Failed to restore session after refresh");
            }
        });
        inflightRefresh.finally(() => {
            inflightRefresh = null;
        });
    }

    return inflightRefresh;
}
