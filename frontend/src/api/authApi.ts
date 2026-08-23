import axios from "axios";

export const authApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_AUTH_SERVER_URL,
    withCredentials: true,
});
