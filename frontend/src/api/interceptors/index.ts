import type { AxiosInstance } from "axios";
import { requestInterceptor } from "./request";
import { responseInterceptor } from "./response";

let initialized = false;
const setupInterceptors = (api: AxiosInstance) => {
    if (initialized) return;
    initialized = true;
    api.interceptors.request.use(requestInterceptor);
    api.interceptors.response.use((res) => res, responseInterceptor);
};

export default setupInterceptors;
