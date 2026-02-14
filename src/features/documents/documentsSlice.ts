import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { DocumentsState, PaginatedDocumentsResponse } from "./documentsTypes";
import { fetchDocuments } from "./documentsApi";

export const getDocuments = createAsyncThunk<
    PaginatedDocumentsResponse,
    { accessToken: string; url?: string | null; name?: string },
    { rejectValue: string }
>(
    "documents/getDocuments",
    async ({ accessToken, url, name }, { rejectWithValue }) => {
        try {
            return await fetchDocuments(accessToken, url, name);
        } catch (err: any) {
            if (err.message === "UNAUTHORIZED") {
                return rejectWithValue("UNAUTHORIZED");
            }
            return rejectWithValue(err.message || "Failed to fetch documents");
        }
    }
);

const initialState: DocumentsState = {
    data: [],
    count: 0,
    next: null,
    previous: null,
    loading: false,
    error: null,
};

const documentsSlice = createSlice({
    name: "documents",
    initialState,
    reducers: {
        clearDocumentsState: (state) => {
            return initialState;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getDocuments.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getDocuments.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload.results;
            state.count = action.payload.count;
            state.next = action.payload.next;
            state.previous = action.payload.previous;
        });
        builder.addCase(getDocuments.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to fetch documents";
        });
    },
});

export const { clearDocumentsState } = documentsSlice.actions;
export default documentsSlice.reducer;
