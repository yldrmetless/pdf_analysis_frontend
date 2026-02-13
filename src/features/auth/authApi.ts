import { RegisterResponse, LoginResponse } from "./authTypes";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const registerUser = async (userData: any): Promise<RegisterResponse> => {
    const response = await fetch(`${API_URL}accounts/register/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
    }

    return response.json();
};

export const loginUser = async (credentials: any): Promise<any> => {
    // The credentials object should match { username_or_email, password }
    const response = await fetch(`${API_URL}accounts/login/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
    }

    return response.json();
};
