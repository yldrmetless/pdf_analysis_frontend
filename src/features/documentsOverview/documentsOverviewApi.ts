import { OverviewStatsResponse, RecentDocumentsResponse, EventLogResponse } from "./documentsOverviewTypes";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetchWithAuth = async (url: string, accessToken: string) => {
    // If the URL is relative (doesn't start with http), prepend API_URL
    const fullUrl = url.startsWith('http') ? url : `${API_URL}${url.startsWith('/') ? url.slice(1) : url}`;

    const response = await fetch(fullUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error("UNAUTHORIZED");
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || `Failed to fetch data: ${response.status}`);
    }

    return response.json();
};

export const fetchOverviewStats = async (accessToken: string): Promise<OverviewStatsResponse> => {
    return fetchWithAuth("documents/overview/", accessToken);
};

export const fetchRecentDocuments = async (accessToken: string, url?: string | null): Promise<RecentDocumentsResponse> => {
    const endpoint = url || "documents/recent-documents/";
    return fetchWithAuth(endpoint, accessToken);
};

export const fetchEventLog = async (accessToken: string, url?: string | null): Promise<EventLogResponse> => {
    const endpoint = url || "documents/event-log/";
    return fetchWithAuth(endpoint, accessToken);
};
