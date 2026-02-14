"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { getFullAnalysisStatus, type DocumentAnalysisStatus } from "@/features/analysis/analysisApi";
import { DocumentAnalysisHeader } from "@/components/documents/DocumentAnalysisHeader";
import { DocumentDetailContent } from "@/components/documents/DocumentDetailContent";
import { SuggestionsModal } from "@/components/documents/SuggestionsModal";
import { DeleteConfirmationModal } from "@/components/documents/DeleteConfirmationModal";
import { Loader2, AlertCircle } from "lucide-react";

export default function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const documentId = parseInt(id, 10);

    const router = useRouter();
    const { token } = useAppSelector((state) => state.auth);

    const [documentData, setDocumentData] = useState<DocumentAnalysisStatus | null>(null);
    const [analysisJson, setAnalysisJson] = useState<any | null>(null);
    const [isSuggestionsModalOpen, setIsSuggestionsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const handleDelete = async () => {
        if (!token || !documentData) return;

        try {
            setIsDeleting(true);
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            // Ensure trailing slash for base and construct endpoint
            const baseUrl = apiUrl?.endsWith('/') ? apiUrl : `${apiUrl}/`;

            // As per instructions: PATCH to /delete/{id}/
            const res = await fetch(`${baseUrl}documents/delete/${documentData.id}/`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Failed to delete document");
            }

            // Success
            router.push("/dashboard/documents");
        } catch (err) {
            console.error("Delete failed", err);
            alert("Failed to delete document. Please try again.");
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    useEffect(() => {
        if (!token) return;

        const fetchDocument = async () => {
            try {
                setLoading(true);
                const res = await getFullAnalysisStatus(documentId, token);
                setDocumentData(res.document);
                setAnalysisJson(res.analysis?.analysis_json ?? null);
            } catch (err: any) {
                console.error("Failed to fetch document", err);
                setError(err.message || "Failed to load document.");
            } finally {
                setLoading(false);
            }
        };

        fetchDocument();
    }, [documentId, token]);

    if (!token) {
        return <div className="p-8 text-center text-gray-500">Please log in to view this document.</div>;
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        );
    }

    if (error || !documentData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <AlertCircle className="w-10 h-10 text-red-500" />
                <p className="text-red-400">{error || "Document not found."}</p>
                <button
                    onClick={() => router.push("/dashboard/documents")}
                    className="text-indigo-400 hover:text-indigo-300 underline"
                >
                    Back to Documents
                </button>
            </div>
        );
    }

    // Prepare content data




    // Helpers
    // const formatSectionTitle = (key: string) => {
    //     return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    // };

    // const hasContent = (obj: any) => {
    //     return obj && (Object.keys(obj).length > 0 || (Array.isArray(obj) && obj.length > 0));
    // };

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in zoom-in duration-500 space-y-8">
            {/* 1. Header Section */}
            <DocumentAnalysisHeader
                title={documentData.title}
                originalName={documentData.original_name}
                createdAt={documentData.created_at}
                fileSize={documentData.file_size}
                mimeType="application/pdf"
                pageCount={documentData.page_count}
                status={documentData.document_status}
                onDelete={() => setIsDeleteModalOpen(true)}
                onShowSuggestions={
                    analysisJson?.suggestions && Array.isArray(analysisJson.suggestions) && analysisJson.suggestions.length > 0
                        ? () => setIsSuggestionsModalOpen(true)
                        : undefined
                }
            />

            {/* 2. Main Content Card */}
            <DocumentDetailContent documentData={documentData} analysisJson={analysisJson} />

            {/* Suggestions Modal */}
            <SuggestionsModal
                isOpen={isSuggestionsModalOpen}
                onClose={() => setIsSuggestionsModalOpen(false)}
                suggestions={analysisJson?.suggestions}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
            />
        </div>
    );
}
