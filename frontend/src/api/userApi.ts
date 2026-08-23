import type { userProfile, userUpdatePayload } from "@/types/user/user-base";
import api from "./axios";

export const getUserProfile = async (): Promise<userProfile> => {
    const response = await api.get<{ id: string; name: string; email: string; pictureUrl: string | null }>("/api/v1/auth/me");
    return {
        id: response.data.id,
        name: response.data.name,
        handle: "",
        email: response.data.email,
        coverUrl: response.data.pictureUrl ?? undefined,
    };
};

export const updateUserProfile = async (
    data: userUpdatePayload,
): Promise<userProfile> => {
    // Profile metadata is intentionally outside the minimal blog API.
    // Do not call the removed /user endpoint.
    return { name: data.name ?? "", handle: data.handle ?? "", ...data };
};
