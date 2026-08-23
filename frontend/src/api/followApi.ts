export const followUser = async (handle: string) => {
    return { handle, isFollowing: false, unavailable: true };
};

export const unfollowUser = async (handle: string) => {
    return { handle, isFollowing: false, unavailable: true };
};

export const getFollowersByHandle = async (handle: string) => {
    return [];
};

export const getFollowingByHandle = async (handle: string) => {
    return [];
};

export const getCountsByHandle = async (handle: string, requesterId?: string) => {
    return { followers: 0, following: 0 };
};
