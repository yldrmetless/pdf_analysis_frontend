import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { uploadDocumentApi } from "./documentsCreateApi";

interface DocumentsCreateState {
    uploading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: DocumentsCreateState = {
    uploading: false,
    error: null,
    success: false,
};

export const uploadDocument = createAsyncThunk<
    any,
    { accessToken: string; file: File; title?: string },
    { rejectValue: string }
>(
    "documentsCreate/uploadDocument",
    async ({ accessToken, file, title }, { rejectWithValue }) => {
        try {
            return await uploadDocumentApi(accessToken, file, title);
        } catch (err: any) {
            if (err.message === "UNAUTHORIZED") {
                return rejectWithValue("UNAUTHORIZED");
            }
            return rejectWithValue(err.message || "Failed to upload document");
        }
    }
);

const documentsCreateSlice = createSlice({
    name: "documentsCreate",
    initialState,
    reducers: {
        resetDocumentsCreateState: (state) => {
            state.uploading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadDocument.pending, (state) => {
                state.uploading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(uploadDocument.fulfilled, (state) => {
                state.uploading = false;
                state.success = true;
            })
            .addCase(uploadDocument.rejected, (state, action) => {
                state.uploading = false;
                state.error = action.payload || "Failed to upload document";
            });
    },
});

export const { resetDocumentsCreateState } = documentsCreateSlice.actions;
export default documentsCreateSlice.reducer;
