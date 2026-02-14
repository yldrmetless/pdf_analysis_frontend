import { supabase } from "@/lib/supabaseClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface SignedUploadResponse {
    results: {
        bucket: string;
        path: string;
        signed_url: string;
        method: string;
        headers: Record<string, string>;
    };
}

export async function getSignedUploadUrl(
    file: File,
    accessToken: string
): Promise<{ signedUrl: string; path: string; headers: Record<string, string> }> {
    if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL missing");

    // 1. Get Signed URL from Backend
    // Note: Backend handles deleting existing files at this path before returning URL.
    const res = await fetch(`${API_URL}documents/supabase/signed-upload/`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            file_name: file.name,
            content_type: "application/pdf",
            file_size: file.size,
        }),
    });

    const json = (await res.json()) as SignedUploadResponse;

    if (!res.ok) {
        if (res.status === 401) throw new Error("UNAUTHORIZED");
        // @ts-ignore
        const detail = json.detail || "Failed to initiate upload.";
        throw new Error(detail);
    }

    const { signed_url, path, headers } = json.results;
    if (!signed_url || !path) throw new Error("Backend did not return signed_url/path");

    return { signedUrl: signed_url, path, headers: headers || {} };
}

export async function uploadFileToSignedUrl(
    signedUrl: string,
    file: File,
    headers: Record<string, string>
) {
    // 2. PUT file bytes directly to Signed URL
    const res = await fetch(signedUrl, {
        method: "PUT",
        headers: {
            ...headers,
            "Content-Type": "application/pdf",
        },
        body: file,
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Upload to storage failed: ${res.status} ${text}`);
    }
}

export async function createDocument(
    payload: {
        title: string;
        original_name: string;
        file_path: string;
        file_size: number;
        mime_type: string;
        checksum: string;
    },
    accessToken: string
) {
    if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL missing");

    const res = await fetch(`${API_URL}documents/create/`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.detail || "Failed to create document record.");
    }

    return await res.json();
}

export async function deleteDocument(documentId: number, accessToken: string) {
    if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL missing");

    const res = await fetch(`${API_URL}documents/${documentId}/`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        throw new Error("Failed to delete document.");
    }
    return true;
}
