"use client";
import { authApi } from "@/api/authApi";
import { useAppDispatch } from "@/hooks/ReduxHooks";
import { logout } from "@/store/reducers/AuthReducers";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useLogout() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    return async function handleLogout() {
        const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_SERVER_URL;
        const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION;

        if (!AUTH_URL || !API_VERSION) {
            throw new Error("Auth server env vars are missing");
        }
        try {
            await authApi.post(
                `${AUTH_URL}${API_VERSION}/auth/logout`,
                {},
                { withCredentials: true },
            );

            dispatch(logout());
            toast.warning("Logout")
            router.replace("/login");
        } catch (e) {
            console.error("Logout failed", e);
        }
    };
}
