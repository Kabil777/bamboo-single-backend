import axios from "axios";

const api = axios.create({
    baseURL: typeof window !== "undefined" ? "" : ((typeof window !== "undefined" ? "" : (process.env.NEXT_PUBLIC_API_SERVER_URL || "http://localhost:8092"))),
    withCredentials: true,
});

export default api;
