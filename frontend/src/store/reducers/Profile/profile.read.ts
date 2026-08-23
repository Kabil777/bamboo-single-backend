import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import api from "@/api/axios";
import {
	AllProfileBlog,
	AllProfileDocs,
	Profile,
	ProfileBlog,
	ProfileDoc,
	ProfileCounts,
} from "@/types/Profile/profile-types";

function getApiErrorMessage(
	e: any,
	fallback: string,
	options?: { suppress404Toast?: boolean; suppressToast?: boolean },
) {
	const status = e?.response?.status;
	const message =
		e?.response?.data?.message ||
		e?.response?.data?.error ||
		e?.message ||
		fallback;

	if (!options?.suppressToast && !(options?.suppress404Toast && status === 404)) {
		toast.error(message);
	}

	return {
		status,
		message,
	};
}

interface ProfileReducersState {
	profileData: Profile | null;
	profileCounts: ProfileCounts | null;
	blogs: AllProfileBlog | null;
	docs: AllProfileDocs | null;

	profileLoading: boolean;
	profileCountsLoading: boolean;
	blogLoading: boolean;
	docsLoading: boolean;
	profileError: string | null;
	profileCountsError: string | null;
	blogError: string | null;
	docsError: string | null;
}

const profileInitialState: ProfileReducersState = {
	profileData: null,
	profileCounts: null,
	blogs: null,
	docs: null,
	profileLoading: false,
	profileCountsLoading: false,
	blogLoading: false,
	docsLoading: false,
	profileError: null,
	profileCountsError: null,
	blogError: null,
	docsError: null,
};

export const getProfileDetials = createAsyncThunk<Profile, void>(
	"/api/getprofile",
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.get<{ id: string; name: string; email: string; pictureUrl: string | null }>("/api/v1/auth/me");
			return { id: response.data.id, name: response.data.name, email: response.data.email, handle: "", coverUrl: response.data.pictureUrl, designation: "", profile: { tags: [], social: {} } };
		} catch (e: any) {
			const { message } = getApiErrorMessage(
				e,
				"Failed to fetch user profile details",
			);
			return rejectWithValue(message);
		}
	},
);

export const getUserProfileByHandle = createAsyncThunk<Profile, string>(
	"/api/getuserprofilebyhandle",
	async (handle: string, { rejectWithValue }) => {
		const apiVersion = process.env.NEXT_PUBLIC_API_VERSION ?? "/api/v1";
		const URL = `${apiVersion}/community/users/${handle}`;
		try {
			const response = await api.get<Profile>(URL);
			return response.data;
		} catch (e: any) {
			const { status, message } = getApiErrorMessage(
				e,
				"Failed to fetch user profile details",
				{ suppress404Toast: true },
			);
			return rejectWithValue(
				status === 404 ? "User not found" : message,
			);
		}
	},
);

export const getProfileCounts = createAsyncThunk<ProfileCounts, void>(
"/api/getprofilecounts",
	async () => {
		const { data } = await api.get<{ posts: ProfileCounts["blogs"]; docs: ProfileCounts["docs"]; bookmarks: number }>("/api/v1/community/me/stats");
		return {
			followers: 0,
			following: 0,
			bookmarks: data.bookmarks,
			blogs: data.posts,
			docs: data.docs,
			otherCounts: {},
		};
	},
);

export const getProfileCountsByHandle = createAsyncThunk<ProfileCounts, string>(
	"/api/getprofilecountsbyhandle",
	async (handle: string, { rejectWithValue }) => {
		const apiVersion = process.env.NEXT_PUBLIC_API_VERSION ?? "/api/v1";
		const URL = `${apiVersion}/community/users/${handle}`;
		try {
			const response = await api.get<{ stats: { posts: ProfileCounts["blogs"]; docs: ProfileCounts["docs"] } }>(URL);
			return { followers: 0, following: 0, bookmarks: 0, blogs: response.data.stats.posts, docs: response.data.stats.docs, otherCounts: {} };
		} catch (e: any) {
			const { message } = getApiErrorMessage(
				e,
				"Failed to fetch profile counts",
				{ suppressToast: true },
			);
			return rejectWithValue(message);
		}
	},
);

export const getAllProfileBlog = createAsyncThunk<AllProfileBlog, void>(
	"/api/getallprofileblog",
	async () => {
		const postsResponse = await api.get<{ data: Array<{
				id: string;
				title: string;
				description?: string | null;
				content: string;
				mediaId: string | null;
				createdAt: string;
				visibility: "PUBLIC" | "UNLISTED" | "PRIVATE";
				author: { id: string; name: string; pictureUrl: string | null };
			}> }>("/api/v1/community/me/posts");
		const apiBase = ((typeof window !== "undefined" ? "" : (process.env.NEXT_PUBLIC_API_SERVER_URL || "http://localhost:8092"))).replace(/\/$/, "");
		return {
			items: postsResponse.data.data.map((post) => ({
					id: post.id,
					title: post.title,
					description: post.description?.trim() || post.content.replace(/<[^>]*>/g, "").slice(0, 180),
					coverUrl: post.mediaId ? `${apiBase}/api/v1/media/${post.mediaId}` : "",
					createdAt: post.createdAt,
					visibility: post.visibility,
					tags: [],
					author: { id: post.author.id, name: post.author.name, handle: "", avatarUrl: post.author.pictureUrl },
				})),
			hasNext: false,
			cursor: null,
		};
	},
);

export const getAllProfileBlogByHandle = createAsyncThunk<
	AllProfileBlog,
	string
>("/api/getallprofileblogbyhandle", async (handle, { rejectWithValue }) => {
	const apiVersion = process.env.NEXT_PUBLIC_API_VERSION ?? "/api/v1";
	const URL = `${apiVersion}/community/users/${handle}/posts`;
	try {
		const response = await api.get<{ data: Array<{ id: string; title: string; description?: string | null; content: string; mediaId: string | null; createdAt: string; visibility: "PUBLIC" | "UNLISTED" | "PRIVATE"; author: { id: string; name: string; pictureUrl: string | null } }> }>(URL);
		const apiBase = ((typeof window !== "undefined" ? "" : (process.env.NEXT_PUBLIC_API_SERVER_URL || "http://localhost:8092"))).replace(/\/$/, "");
		return { items: response.data.data.map((post) => ({ id: post.id, title: post.title, description: post.description?.trim() || post.content.replace(/<[^>]*>/g, "").slice(0, 180), coverUrl: post.mediaId ? `${apiBase}/api/v1/media/${post.mediaId}` : "", createdAt: post.createdAt, visibility: post.visibility, tags: [], author: { id: post.author.id, name: post.author.name, handle: "", avatarUrl: post.author.pictureUrl } })), hasNext: false, cursor: null };
	} catch (e: any) {
		const { message } = getApiErrorMessage(
			e,
			"Failed to fetch user profile blogs",
			{ suppressToast: true },
		);
		return rejectWithValue(message);
	}
});

export const getAllProfileDocs = createAsyncThunk<AllProfileDocs, void>(
"/api/getallprofiledocs",
	async () => {
		const documentsResponse = await api.get<{ data: Array<{
				id: string;
				title: string;
				content: string;
				mediaId: string | null;
				createdAt: string;
				visibility: "PUBLIC" | "UNLISTED" | "PRIVATE";
				author: { id: string; name: string; pictureUrl: string | null };
			}> }>("/api/v1/docs/me");
		const apiBase = ((typeof window !== "undefined" ? "" : (process.env.NEXT_PUBLIC_API_SERVER_URL || "http://localhost:8092"))).replace(/\/$/, "");
		return {
			items: documentsResponse.data.data.map((document) => ({
					id: document.id,
					title: document.title,
					description: document.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 180),
					coverUrl: document.mediaId ? `${apiBase}/api/v1/media/${document.mediaId}` : "",
					createdAt: document.createdAt,
					visibility: document.visibility,
					author: { id: document.author.id, name: document.author.name, handle: "", avatarUrl: document.author.pictureUrl },
				})),
			hasNext: false,
			cursor: null,
		};
	},
);

export const getAllProfileDocsByHandle = createAsyncThunk<
	AllProfileDocs,
	string
>("/api/getallprofiledocsbyhandle", async (handle, { rejectWithValue }) => {
	try {
		const apiVersion = process.env.NEXT_PUBLIC_API_VERSION ?? "/api/v1";
		const response = await api.get<{ data: Array<{ id: string; title: string; content: string; mediaId: string | null; createdAt: string; visibility: "PUBLIC" | "UNLISTED" | "PRIVATE"; author: { id: string; name: string; pictureUrl: string | null } }> }>(`${apiVersion}/community/users/${handle}/docs`);
		const apiBase = ((typeof window !== "undefined" ? "" : (process.env.NEXT_PUBLIC_API_SERVER_URL || "http://localhost:8092"))).replace(/\/$/, "");
		return { items: response.data.data.map((doc) => ({ id: doc.id, title: doc.title, description: doc.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 180), coverUrl: doc.mediaId ? `${apiBase}/api/v1/media/${doc.mediaId}` : "", createdAt: doc.createdAt, visibility: doc.visibility, author: { id: doc.author.id, name: doc.author.name, handle: "", avatarUrl: doc.author.pictureUrl } })), hasNext: false, cursor: null };
	} catch (e: any) {
		const { message } = getApiErrorMessage(e, "Failed to fetch user profile docs", { suppressToast: true });
		return rejectWithValue(message);
	}
});

const getProfile = createSlice({
	name: "getProfileReducers",
	initialState: profileInitialState,
	reducers: {
		resetProfileView: (state) => {
			state.profileData = null;
			state.profileCounts = null;
			state.profileError = null;
			state.profileCountsError = null;
			state.profileLoading = false;
			state.profileCountsLoading = false;
		},
		resetProfileCollections: (state) => {
			state.blogs = null;
			state.docs = null;
			state.blogError = null;
			state.docsError = null;
			state.blogLoading = false;
			state.docsLoading = false;
		},
		removeProfileBlogItem: (state, action: PayloadAction<string>) => {
			if (!state.blogs) return;
			state.blogs.items = state.blogs.items.filter((item) => item.id !== action.payload);
			if (state.profileCounts?.blogs) {
				state.profileCounts.blogs.total = Math.max(0, state.profileCounts.blogs.total - 1);
			}
		},
		removeProfileDocItem: (state, action: PayloadAction<string>) => {
			if (!state.docs) return;
			state.docs.items = state.docs.items.filter((item) => item.id !== action.payload);
			if (state.profileCounts?.docs) {
				state.profileCounts.docs.total = Math.max(0, state.profileCounts.docs.total - 1);
			}
		},
		updateProfileBlogMeta: (
			state,
			action: PayloadAction<{
				id: string;
				visibility?: ProfileBlog["visibility"];
				status?: ProfileBlog["status"];
			}>,
		) => {
			const target = state.blogs?.items.find((item) => item.id === action.payload.id);
			if (!target) return;
			if (action.payload.visibility !== undefined) target.visibility = action.payload.visibility;
			if (action.payload.status !== undefined) target.status = action.payload.status;
		},
		updateProfileDocMeta: (
			state,
			action: PayloadAction<{
				id: string;
				visibility?: ProfileDoc["visibility"];
				status?: ProfileDoc["status"];
			}>,
		) => {
			const target = state.docs?.items.find((item) => item.id === action.payload.id);
			if (!target) return;
			if (action.payload.visibility !== undefined) target.visibility = action.payload.visibility;
			if (action.payload.status !== undefined) target.status = action.payload.status;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getProfileDetials.pending, (state) => {
				state.profileLoading = true;
				state.profileError = null;
			})
			.addCase(getProfileDetials.fulfilled, (state, action) => {
				state.profileLoading = false;
				state.profileData = action.payload;
			})
			.addCase(getProfileDetials.rejected, (state, action) => {
				state.profileLoading = false;
				state.profileError = action.payload as string;
			});

		// ======================
		// GET USER PROFILE BY HANDLE
		// ======================
		builder
			.addCase(getUserProfileByHandle.pending, (state) => {
				state.profileLoading = true;
				state.profileError = null;
				state.profileData = null; // Clear old profile data
			})
			.addCase(getUserProfileByHandle.fulfilled, (state, action) => {
				state.profileLoading = false;
				state.profileData = action.payload;
			})
			.addCase(getUserProfileByHandle.rejected, (state, action) => {
				state.profileLoading = false;
				state.profileData = null; // Clear profile data on error
				state.profileError = action.payload as string;
			});

		builder
			.addCase(getProfileCounts.pending, (state) => {
				state.profileCountsLoading = true;
				state.profileCountsError = null;
			})
			.addCase(getProfileCounts.fulfilled, (state, action) => {
				state.profileCountsLoading = false;
				state.profileCounts = action.payload;
			})
			.addCase(getProfileCounts.rejected, (state, action) => {
				state.profileCountsLoading = false;
				state.profileCountsError = action.payload as string;
			});

		builder
			.addCase(getProfileCountsByHandle.pending, (state) => {
				state.profileCountsLoading = true;
				state.profileCountsError = null;
			})
			.addCase(getProfileCountsByHandle.fulfilled, (state, action) => {
				state.profileCountsLoading = false;
				state.profileCounts = action.payload;
			})
			.addCase(getProfileCountsByHandle.rejected, (state, action) => {
				state.profileCountsLoading = false;
				state.profileCountsError = action.payload as string;
			});

		// ======================
		// GET PROFILE BLOGS
		// ======================
		builder
			.addCase(getAllProfileBlog.pending, (state) => {
				state.blogLoading = true;
				state.blogError = null;
			})
			.addCase(getAllProfileBlog.fulfilled, (state, action) => {
				state.blogLoading = false;
				state.blogs = action.payload;
			})
			.addCase(getAllProfileBlog.rejected, (state, action) => {
				state.blogLoading = false;
				state.blogError = action.payload as string;
				state.blogs = { items: [], hasNext: false, cursor: null };
			});

		builder
			.addCase(getAllProfileBlogByHandle.pending, (state) => {
				state.blogLoading = true;
				state.blogError = null;
			})
			.addCase(getAllProfileBlogByHandle.fulfilled, (state, action) => {
				state.blogLoading = false;
				state.blogs = action.payload;
			})
			.addCase(getAllProfileBlogByHandle.rejected, (state, action) => {
				state.blogLoading = false;
				state.blogError = action.payload as string;
				state.blogs = { items: [], hasNext: false, cursor: null };
			});

		// ======================
		// GET PROFILE DOCS
		// ======================
		builder
			.addCase(getAllProfileDocs.pending, (state) => {
				state.docsLoading = true;
				state.docsError = null;
			})
			.addCase(getAllProfileDocs.fulfilled, (state, action) => {
				state.docsLoading = false;
				state.docs = action.payload;
			})
			.addCase(getAllProfileDocs.rejected, (state, action) => {
				state.docsLoading = false;
				state.docsError = action.payload as string;
				state.docs = { items: [], hasNext: false, cursor: null };
			});

		builder
			.addCase(getAllProfileDocsByHandle.pending, (state) => {
				state.docsLoading = true;
				state.docsError = null;
			})
			.addCase(getAllProfileDocsByHandle.fulfilled, (state, action) => {
				state.docsLoading = false;
				state.docs = action.payload;
			})
			.addCase(getAllProfileDocsByHandle.rejected, (state, action) => {
				state.docsLoading = false;
				state.docsError = action.payload as string;
				state.docs = { items: [], hasNext: false, cursor: null };
			});
	},
});

export const {
	resetProfileCollections,
	resetProfileView,
	removeProfileBlogItem,
	removeProfileDocItem,
	updateProfileBlogMeta,
	updateProfileDocMeta,
} = getProfile.actions;
export default getProfile.reducer;
