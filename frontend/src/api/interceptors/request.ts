import store from "@/store/store";
import type { InternalAxiosRequestConfig } from "axios";
import { authResolved } from "../auth/authGate";

export const requestInterceptor = async (
    config: InternalAxiosRequestConfig,
) => {
    await authResolved;

    const token = (store.getState().userReducer as any)?.accessToken;
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
};
