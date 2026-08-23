import axios from "axios";

export const authApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_AUTH_SERVER_URL || "http://localhost:8092",
    withCredentials: true,
});
