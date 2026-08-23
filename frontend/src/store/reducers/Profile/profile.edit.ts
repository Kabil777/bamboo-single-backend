import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";

import type {
    AllProfileBlog,
    Profile,
    SocialLinks,
    SocialPlatform,
    UserProfile,
} from "@/types/Profile/profile-types";

// set signup page reducers
interface SetProfileReducersState {
    designation: string;
    userProfile: {
        tags: string[];
        social: SocialLinks;
    };
}

const initialState: SetProfileReducersState = {
    designation: "",
    userProfile: {
        tags: [],
        social: {},
    },
};

export const setProfileApi = createAsyncThunk<void, SetProfileReducersState>(
	"/api/setprofile",
	async (data) => {
		toast.info("Profile metadata is not part of the minimal blog API");
	},
);

const setProfileReducers = createSlice({
    name: "setProfileReducers",
    initialState: initialState,
    reducers: {
        setAllProfile: (
            state,
            action: PayloadAction<SetProfileReducersState>,
        ) => {
            return action.payload;
        },
    },
});
export const { setAllProfile } = setProfileReducers.actions;

export default setProfileReducers.reducer;
