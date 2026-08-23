import type { AxiosInstance } from "axios";
import { responseInterceptor } from "./response";

let initialized = false;
const setupInterceptors = (api: AxiosInstance) => {
    if (initialized) return;
    initialized = true;
    api.interceptors.response.use((res) => res, responseInterceptor);
};

export default setupInterceptors;
