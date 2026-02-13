export interface Document {
    id: number;
    title: string;
    original_name: string;
    file_path: string;
    file_size: number;
    mime_type: string;
    status: string;
    page_count: number | null;
    language: string;
    preview_text: string;
    created_at: string;
    latest_preview_job_status: string | null;
    latest_preview_job_progress: number | null;
    latest_preview_job_error: string;
    chunk_count: number;
}

export interface PaginatedDocumentsResponse {
    status: number;
    count: number;
    next: string | null;
    previous: string | null;
    results: Document[];
}

export interface DocumentsState {
    data: Document[];
    count: number;
    next: string | null;
    previous: string | null;
    loading: boolean;
    error: string | null;
}
