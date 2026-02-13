export interface RecentDocument {
    id: number;
    document_name: string;
    status: string;
    uploaded_at: string;
}

export interface EventLog {
    ts: string;
    event: string;
    detail: string;
    document_id: number;
}

export interface OverviewStats {
    total_documents: number;
    processing: number;
    ready: number;
    errors: number;
}

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export interface OverviewStatsResponse {
    status: number;
    results: OverviewStats;
}

export interface RecentDocumentsResponse extends PaginatedResponse<RecentDocument> {
    status: number;
}

export interface EventLogResponse extends PaginatedResponse<EventLog> {
    status: number;
}

export interface DocumentsOverviewState {
    stats: {
        data: OverviewStats | null;
        loading: boolean;
        error: string | null;
    };
    recentDocuments: {
        data: RecentDocument[];
        count: number;
        next: string | null;
        previous: string | null;
        loading: boolean;
        error: string | null;
    };
    eventLog: {
        data: EventLog[];
        count: number;
        next: string | null;
        previous: string | null;
        loading: boolean;
        error: string | null;
    };
}
