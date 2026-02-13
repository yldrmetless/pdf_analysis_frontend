import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { registerUser, loginUser } from "./authApi";
import { AuthState, RegisterResponse, ApiError, LoginResponse, LoginRequest } from "./authTypes";
import { setTokens, clearTokens } from "./tokenStorage";

// Async Thunk for Registration
export const register = createAsyncThunk<
    RegisterResponse,
    any, // We will refine the input type when Zod schema is available
    { rejectValue: ApiError }
>(
    "auth/register",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await registerUser(userData);
            return response;
        } catch (err: any) {
            // Return the error object from the API
            return rejectWithValue(err as ApiError);
        }
    }
);

// Async Thunk for Login
export const login = createAsyncThunk<
    LoginResponse,
    LoginRequest,
    { rejectValue: ApiError }
>(
    "auth/login",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await loginUser(credentials);
            return response;
        } catch (err: any) {
            return rejectWithValue(err as ApiError);
        }
    }
);

interface ExtendedAuthState extends AuthState {
    expiresTime: number | null;
    expiresAt: number | null;
    refreshToken: string | null;
}

const initialState: ExtendedAuthState = {
    user: null,
    token: null,
    refreshToken: null,
    expiresTime: null,
    expiresAt: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    registrationSuccess: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        resetAuth: (state) => {
            state.loading = false;
            state.error = null;
            state.registrationSuccess = false;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            state.expiresTime = null;
            state.expiresAt = null;
            state.isAuthenticated = false;
            clearTokens();
        },
        hydrateAuth: (state, action: PayloadAction<{ accessToken: string; refreshToken: string; expiresTime: number; expiresAt: number }>) => {
            state.token = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.expiresTime = action.payload.expiresTime;
            state.expiresAt = action.payload.expiresAt;
            state.isAuthenticated = true;
        }
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.registrationSuccess = false;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.registrationSuccess = true;
                // Optionally set user if registration auto-logs in, but usually it doesn't
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.registrationSuccess = false;
                if (action.payload) {
                    // If payload is an object (validation errors), we might want to store it differently
                    // For now, let's just store a generic error or the first error message if possible
                    // Ideally the component handles field-specific errors from the payload
                    // state.error = "Registration failed. Please check your inputs.";
                    state.error = action.payload.detail || "Registration failed";
                } else {
                    state.error = action.error.message || "Registration failed";
                }
            })
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.token = action.payload.access_token;
                state.refreshToken = action.payload.refresh_token;
                state.expiresTime = action.payload.expires_time;
                // expiresAt is calculated in storage, but we can also store it in state if passed or calculated here. 
                // Alternatively, component triggers hydration.
                // Minimal state update here, hydration handles full persistence check on load.

                setTokens(action.payload.access_token, action.payload.refresh_token, action.payload.expires_time);
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                if (action.payload) {
                    state.error = action.payload.detail || "Login failed";
                } else {
                    state.error = action.error.message || "Login failed";
                }
            });
    },
});

export const { resetAuth, logout, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;
