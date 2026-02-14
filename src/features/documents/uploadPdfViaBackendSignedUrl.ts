import { supabase } from "@/lib/supabaseClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type SupabaseUploadResult = {
    path: string;
    size: number;
    originalName: string;
    mimeType: string;
};

export async function uploadPdfViaBackendSignedUrl(
    file: File,
    accessToken: string
): Promise<SupabaseUploadResult> {

    if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL missing");
    if (!file) throw new Error("No file provided");
    if (file.type !== "application/pdf") throw new Error("Only PDF files are allowed.");
    if (file.size > 50 * 1024 * 1024) throw new Error("Max file size is 50MB.");

    // 1️⃣ Get signed upload token from backend
    const initRes = await fetch(`${API_URL}documents/supabase/signed-upload/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            file_name: file.name,
            content_type: "application/pdf",
            file_size: file.size,
        }),
    });

    const initJson = await initRes.json().catch(() => ({}));

    if (!initRes.ok) {
        if (initRes.status === 401) throw new Error("UNAUTHORIZED");
        throw new Error(initJson.detail || "Failed to initiate upload.");
    }

    const { signed_url, path, method, headers } = initJson.results || {};

    if (!signed_url || !path) {
        throw new Error("Backend did not return signed_url/path");
    }

    // 2️⃣ Upload file using fetch to signed_url
    // No need for Supabase SDK here as we have the direct signed URL
    const uploadRes = await fetch(signed_url, {
        method: method || "PUT",
        headers: headers || { "Content-Type": "application/pdf" },
        body: file,
    });

    if (!uploadRes.ok) {
        const text = await uploadRes.text().catch(() => "");
        throw new Error(`Upload to storage failed: ${uploadRes.status} ${text}`);
    }

    return {
        path,
        size: file.size,
        originalName: file.name,
        mimeType: file.type,
    };
}
