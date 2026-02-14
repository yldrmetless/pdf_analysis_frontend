const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
    console.warn("NEXT_PUBLIC_API_URL is missing in environment");
}

export interface AnalysisJob {
    id: number;
    job_type: string;
    status: "PENDING" | "SUCCESS" | "FAILED";
    progress: number;
    created_at: string;
}

export interface DocumentAnalysisStatus {
    id: number;
    title: string;
    original_name: string;
    created_at: string;
    file_size: number;
    document_status: "READY" | "PENDING" | "FAILED" | "PROCESSING" | "UPLOADED" | "PREVIEW_READY";
    page_count: number | null;
}

export interface FullAnalysisStatusResponse {
    status: number;
    document: DocumentAnalysisStatus;
    analysis?: {
        analysis_text: string;
        analysis_json: any;
        ai_raw?: string;
    };
    job?: {
        id: number;
        status: string;
        progress: number;
        error: string;
        finished_at?: string | null;
    };
}

export async function startFullAnalysis(documentId: number, accessToken: string): Promise<{ status: number; message: string; job: AnalysisJob }> {
    const res = await fetch(`${API_URL}analysis/full-analysis/${documentId}/`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        const errorText = await res.text().catch(() => "Unknown error");
        throw new Error(`Failed to start analysis: ${res.status} ${errorText}`);
    }

    return await res.json();
}

export async function getFullAnalysisStatus(documentId: number, accessToken: string): Promise<FullAnalysisStatusResponse> {
    const res = await fetch(`${API_URL}analysis/full-analysis/${documentId}/`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
        },
    });

    if (!res.ok) {
        const errorText = await res.text().catch(() => "Unknown error");
        throw new Error(`Failed to get analysis status: ${res.status} ${errorText}`);
    }

    return await res.json();
}
