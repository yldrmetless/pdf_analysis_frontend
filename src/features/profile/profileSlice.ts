import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ProfileState, ProfileResponse } from "./profileTypes";
import { fetchMyProfile } from "./profileApi";

export const fetchProfile = createAsyncThunk<
    ProfileResponse,
    string,
    { rejectValue: string }
>(
    "profile/fetchMyProfile",
    async (accessToken, { rejectWithValue }) => {
        try {
            const response = await fetchMyProfile(accessToken);
            return response;
        } catch (err: any) {
            return rejectWithValue(err.message || "Failed to fetch profile");
        }
    }
);

const initialState: ProfileState = {
    data: null,
    loading: false,
    error: null,
};

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        clearProfile: (state) => {
            state.data = null;
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.results;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch profile";
            });
    },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
