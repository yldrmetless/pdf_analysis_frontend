export interface User {
    id: number;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
}

export interface AuthState {
    user: User | null;
    token: string | null; // Placeholder for future token storage
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    registrationSuccess: boolean;
}

export interface RegisterResponse {
    id: number;
    username: string;
    email: string;
    // Add other fields returned by backend if necessary
}

export interface LoginRequest {
    username_or_email: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    expires_time: number;
}

export interface ApiError {
    detail?: string;
    [key: string]: string | string[] | undefined; // For field-specific errors like { "email": ["Enter a valid email."] }
}
