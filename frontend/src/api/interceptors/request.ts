import store from "@/store/store";
import type { InternalAxiosRequestConfig } from "axios";

export const requestInterceptor = async (
    config: InternalAxiosRequestConfig,
) => {
    // Cookie-based authentication must not wait for the bootstrap request:
    // that request itself uses this Axios client. Keep bearer support for any
    // future token-backed session without blocking protected requests.
    const token = (store.getState().userReducer as { accessToken?: string })
        .accessToken;
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
};
