import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    DocumentsOverviewState,
    OverviewStatsResponse,
    RecentDocumentsResponse,
    EventLogResponse
} from "./documentsOverviewTypes";
import { fetchOverviewStats, fetchRecentDocuments, fetchEventLog } from "./documentsOverviewApi";

// Thunks
export const getStats = createAsyncThunk<
    OverviewStatsResponse,
    string,
    { rejectValue: string }
>(
    "documentsOverview/getStats",
    async (accessToken, { rejectWithValue }) => {
        try {
            return await fetchOverviewStats(accessToken);
        } catch (err: any) {
            if (err.message === "UNAUTHORIZED") {
                return rejectWithValue("UNAUTHORIZED");
            }
            return rejectWithValue(err.message || "Failed to fetch stats");
        }
    }
);

export const getRecentDocs = createAsyncThunk<
    RecentDocumentsResponse,
    { accessToken: string; url?: string | null },
    { rejectValue: string }
>(
    "documentsOverview/getRecentDocs",
    async ({ accessToken, url }, { rejectWithValue }) => {
        try {
            return await fetchRecentDocuments(accessToken, url);
        } catch (err: any) {
            if (err.message === "UNAUTHORIZED") {
                return rejectWithValue("UNAUTHORIZED");
            }
            return rejectWithValue(err.message || "Failed to fetch recent documents");
        }
    }
);

export const getEventLogs = createAsyncThunk<
    EventLogResponse,
    { accessToken: string; url?: string | null },
    { rejectValue: string }
>(
    "documentsOverview/getEventLogs",
    async ({ accessToken, url }, { rejectWithValue }) => {
        try {
            return await fetchEventLog(accessToken, url);
        } catch (err: any) {
            if (err.message === "UNAUTHORIZED") {
                return rejectWithValue("UNAUTHORIZED");
            }
            return rejectWithValue(err.message || "Failed to fetch event logs");
        }
    }
);

const initialState: DocumentsOverviewState = {
    stats: { data: null, loading: false, error: null },
    recentDocuments: {
        data: [],
        count: 0,
        next: null,
        previous: null,
        loading: false,
        error: null
    },
    eventLog: {
        data: [],
        count: 0,
        next: null,
        previous: null,
        loading: false,
        error: null
    },
};

const documentsOverviewSlice = createSlice({
    name: "documentsOverview",
    initialState,
    reducers: {
        clearOverviewState: (state) => {
            return initialState;
        }
    },
    extraReducers: (builder) => {
        // Stats
        builder.addCase(getStats.pending, (state) => {
            state.stats.loading = true;
            state.stats.error = null;
        });
        builder.addCase(getStats.fulfilled, (state, action) => {
            state.stats.loading = false;
            state.stats.data = action.payload.results;
        });
        builder.addCase(getStats.rejected, (state, action) => {
            state.stats.loading = false;
            state.stats.error = action.payload || "Failed to fetch stats";
        });

        // Recent Docs
        builder.addCase(getRecentDocs.pending, (state) => {
            state.recentDocuments.loading = true;
            state.recentDocuments.error = null;
        });
        builder.addCase(getRecentDocs.fulfilled, (state, action) => {
            state.recentDocuments.loading = false;
            state.recentDocuments.data = action.payload.results;
            state.recentDocuments.count = action.payload.count;
            state.recentDocuments.next = action.payload.next;
            state.recentDocuments.previous = action.payload.previous;
        });
        builder.addCase(getRecentDocs.rejected, (state, action) => {
            state.recentDocuments.loading = false;
            state.recentDocuments.error = action.payload || "Failed to fetch recent documents";
        });

        // Event Logs
        builder.addCase(getEventLogs.pending, (state) => {
            state.eventLog.loading = true;
            state.eventLog.error = null;
        });
        builder.addCase(getEventLogs.fulfilled, (state, action) => {
            state.eventLog.loading = false;
            state.eventLog.data = action.payload.results;
            state.eventLog.count = action.payload.count;
            state.eventLog.next = action.payload.next;
            state.eventLog.previous = action.payload.previous;
        });
        builder.addCase(getEventLogs.rejected, (state, action) => {
            state.eventLog.loading = false;
            state.eventLog.error = action.payload || "Failed to fetch event logs";
        });
    },
});

export const { clearOverviewState } = documentsOverviewSlice.actions;
export default documentsOverviewSlice.reducer;
