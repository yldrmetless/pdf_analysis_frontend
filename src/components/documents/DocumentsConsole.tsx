"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, Info, Upload } from "lucide-react"; // Info isn't used but might be good for tooltip later
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getDocuments, clearDocumentsState } from "@/features/documents/documentsSlice";
import { DocumentsStatCard } from "./DocumentsStatCard";
import { DocumentsTable } from "./DocumentsTable";
import { TextInput } from "@/components/ui/TextInput";
import { useRouter } from "next/navigation";
import { logout } from "@/features/auth/authSlice";

export function DocumentsConsole() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { token } = useAppSelector((state) => state.auth);
    const { data, count, next, previous, loading, error } = useAppSelector((state) => state.documents);
    const [searchQuery, setSearchQuery] = useState("");

    // Initial Fetch
    useEffect(() => {
        if (!token) return;
        dispatch(getDocuments({ accessToken: token }));

        return () => {
            dispatch(clearDocumentsState());
        };
    }, [dispatch, token]);

    // Error Handling
    useEffect(() => {
        if (error === "UNAUTHORIZED") {
            dispatch(logout());
            router.push("/login"); // Redirect
        }
    }, [error, dispatch, router]);

    const handlePageChange = useCallback((url: string | null) => {
        if (token && url) {
            dispatch(getDocuments({ accessToken: token, url }));
        }
    }, [dispatch, token]);

    // Client-side filtering
    const filteredDocuments = data.filter(doc =>
        doc.original_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const [page, setPage] = useState(1);
    const PAGE_SIZE = 20; // Assumption, adjust if API default is different.

    const handleNext = () => {
        handlePageChange(next);
        setPage(p => p + 1);
    };

    const handlePrevious = () => {
        handlePageChange(previous);
        setPage(p => Math.max(1, p - 1));
    };

    const startIndex = (page - 1) * PAGE_SIZE;

    return (
        <div className="space-y-8">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-semibold text-white">Document Console</h1>
                <div className="w-full md:w-80">
                    <TextInput
                        placeholder="Document Name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-[#0B0E14] border-[#1F2937] text-white placeholder:text-gray-500"
                        leftIcon={<Search className="h-4 w-4 text-gray-500" />}
                    />
                </div>
            </div>

            {/* Error Message */}
            {error && error !== "UNAUTHORIZED" && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                </div>
            )}

            {/* Total Count Card */}
            <div className="max-w-xs">
                <DocumentsStatCard count={count} loading={loading && data.length === 0} />
            </div>

            {/* Documents Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">Documents</h2>
                    <button
                        onClick={() => router.push("/dashboard/documents/document-create")}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
                        title="Upload New Document"
                    >
                        <Upload className="h-4 w-4" />
                        Upload New Document
                    </button>
                </div>

                {/* Documents Table Container */}
                <div className="h-[600px]">
                    <DocumentsTable
                        documents={filteredDocuments}
                        loading={loading}
                        count={count}
                        next={next}
                        previous={previous}
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                        startIndex={startIndex}
                    />
                </div>
            </div>
        </div>
    );
}
