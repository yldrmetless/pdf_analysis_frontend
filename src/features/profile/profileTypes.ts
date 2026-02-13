export interface UserProfile {
    id?: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
}

export interface ProfileResponse {
    status: number;
    results: UserProfile;
}

export interface ProfileState {
    data: UserProfile | null;
    loading: boolean;
    error: string | null;
}
