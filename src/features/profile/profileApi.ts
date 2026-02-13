import { ProfileResponse } from "./profileTypes";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchMyProfile = async (accessToken: string): Promise<ProfileResponse> => {
    const response = await fetch(`${API_URL}accounts/my-profile/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || `Failed to fetch profile: ${response.status}`);
    }

    return response.json();
};
