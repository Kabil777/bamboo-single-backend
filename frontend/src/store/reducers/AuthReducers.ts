import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/api/axios";

interface AuthState {
	user: {
		name: string;
		handle: string;
		email: string;
		profileImg: string;
		role: string;
	} | null;
	status: "loading" | "authorized" | "logged_out" | "unauthorized" | "idle";
}

export const getAuthentication = createAsyncThunk(
"/login/google",
	async (_, { rejectWithValue }) => {
		try {
			// The reduced backend exposes identity through /auth/me. The old
			// /user/meta profile endpoint was intentionally removed.
			const response = await api.get(
				`${process.env.NEXT_PUBLIC_API_VERSION ?? "/api/v1"}/auth/me`,
			);

			console.log(response);
			return response.data;
		} catch (e: unknown) {
			console.log(e);
			const error = e as {
				response?: { status?: number; data?: string };
			};
			return rejectWithValue({
				status: error?.response?.status ?? 0,
				details: error?.response?.data ?? "Unknown error",
			});
		}
	},
);

const inititialState: AuthState = {
	user: null,
	status: "idle",
};

const userDetailsSlice = createSlice({
	name: "userDetails",
	initialState: inititialState,
	reducers: {
		logout: (state) => {
			Object.assign(state, inititialState);
			state.status = "logged_out";
		},
		setAuthentication: (s, a) => {
			const user = a.payload;
			const normalizedName =
				user.name?.trim() ||
				user.handle?.trim() ||
				user.email?.trim() ||
				"User";

			s.user = {
				name: normalizedName,
				handle: user.handle ?? "",
				email: user.email,
				profileImg: user.pictureUrl ?? "",
				role: user.role ?? "USER",
			};
			s.status = "authorized";
		},
	},
	extraReducers: (builder) => {
		builder
		.addCase(getAuthentication.fulfilled, (s, a) => {
				const normalizedName =
					a.payload.name?.trim() ||
					a.payload.handle?.trim() ||
					a.payload.email?.trim() ||
					"User";

				s.user = {
					name: normalizedName,
					handle: a.payload.handle ?? "",
					email: a.payload.email,
					profileImg: a.payload.pictureUrl ?? "",
					role: a.payload.role ?? "USER",
				};
				s.status = "authorized";
				console.log(JSON.parse(JSON.stringify(s)));
			})
			.addCase(getAuthentication.pending, (state) => {
				state.status = "loading";
			})
			.addCase(getAuthentication.rejected, (state) => {
				state.status = "unauthorized";
				state.user = null;
			});
	},
});

export const { logout, setAuthentication } = userDetailsSlice.actions;
export default userDetailsSlice.reducer;
