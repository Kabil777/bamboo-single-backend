import store from "@/store/store";
import { toast } from "sonner";
import { authApi } from "../authApi";
import api from "../axios";
import { logout } from "@/store/reducers/AuthReducers";

let isRefreshing = false;
let failedQueue: any[] = [];


const recentOutageToasts = new Map<string, number>();
const OUTAGE_TOAST_WINDOW_MS = 5000;

function getServiceLabel(url?: string) {
    if (!url) return "Service";

    try {
        const absoluteUrl = url.startsWith("http")
            ? new URL(url)
            : new URL(url, typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_API_SERVER_URL || "http://localhost:8092"));
        return absoluteUrl.hostname === "localhost"
            ? `${absoluteUrl.port || absoluteUrl.hostname}`
            : absoluteUrl.hostname;
    } catch {
        return "Service";
    }
}

function maybeToastServiceUnavailable(error: any) {
    if (error?.response) return;

    const code = error?.code;
    const message = String(error?.message || "").toLowerCase();
    const isNetworkOutage =
        code === "ERR_NETWORK" ||
        code === "ECONNREFUSED" ||
        message.includes("network error") ||
        message.includes("connection refused") ||
        message.includes("failed to fetch");

    if (!isNetworkOutage) return;

    const service = getServiceLabel(error?.config?.url);
    const cacheKey = `${service}:${code || "network"}`;
    const now = Date.now();
    const lastShownAt = recentOutageToasts.get(cacheKey) ?? 0;

    if (now - lastShownAt < OUTAGE_TOAST_WINDOW_MS) return;

    recentOutageToasts.set(cacheKey, now);
    toast.error(`${service} service is unavailable right now.`);
}

const processQueue = (error: any) => {
    failedQueue.forEach(({ resolve, reject }) => {
        error ? reject(error) : resolve();
    });
    failedQueue = [];
};

export const responseInterceptor = async (error: any) => {
    maybeToastServiceUnavailable(error);
    const originalRequest = error.config;

    if (originalRequest?.url?.includes("/auth/refresh")) {
        store.dispatch(logout());
        return Promise.reject(error);
    }

    if (
        error.response?.status === 401 &&
        !originalRequest?._retry
    ) {
        if (!originalRequest) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then(() => api(originalRequest));
        }

        isRefreshing = true;

        try {
            const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || "/api/v1";
            const URL = `${apiVersion}/auth/refresh`;
            await authApi.post(URL);

            processQueue(null);
            return api(originalRequest);
        } catch (err) {
            processQueue(err);
            store.dispatch(logout());
            console.log(err);
            return Promise.reject(err);
        } finally {
            isRefreshing = false;
        }
    }

    return Promise.reject(error);
};
