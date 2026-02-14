"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, X, Upload, CheckCircle, Play, Loader2, AlertCircle } from "lucide-react";
import { formatBytes } from "@/lib/fileFormat";
import { useAppSelector } from "@/store/hooks";
import { getSignedUploadUrl, uploadFileToSignedUrl, createDocument } from "@/lib/api/documents";
import { startFullAnalysis, getFullAnalysisStatus, type DocumentAnalysisStatus } from "@/features/analysis/analysisApi";

export default function DocumentCreatePage() {
    const router = useRouter();
    const { token } = useAppSelector((state) => state.auth);

    // Upload & Creation State
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [createStatus, setCreateStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
    const [createError, setCreateError] = useState("");
    const [documentId, setDocumentId] = useState<number | null>(null);

    // Analysis State
    const [analysisStatus, setAnalysisStatus] = useState<"idle" | "posting" | "polling" | "ready" | "failed">("idle");
    const [analysisProgress, setAnalysisProgress] = useState(0);
    const [documentData, setDocumentData] = useState<DocumentAnalysisStatus | null>(null);
    const [analysisError, setAnalysisError] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);
    const pollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current);
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        };
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type !== "application/pdf") {
                setCreateError("Only PDF files are allowed.");
                return;
            }
            if (selectedFile.size > 50 * 1024 * 1024) {
                setCreateError("File size must be less than 50MB.");
                return;
            }
            setFile(selectedFile);
            setCreateError("");
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        setCreateError("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleFinishAndSave = async () => {
        if (!file || !token) return;

        setCreateStatus("uploading");
        setCreateError("");

        try {
            // 1. Get Signed URL
            const { signedUrl, path, headers } = await getSignedUploadUrl(file, token);

            // 2. Upload to Supabase storage
            await uploadFileToSignedUrl(signedUrl, file, headers);

            // 3. Create Document Record in Backend
            const nameWithoutExt = file.name.replace(/\.pdf$/i, "");
            const checksum = `${nameWithoutExt}_1`;

            const doc = await createDocument(
                {
                    title: title || "",
                    original_name: file.name,
                    file_path: path,
                    file_size: file.size,
                    mime_type: "application/pdf",
                    checksum: checksum,
                },
                token
            );

            if (doc && doc.id) {
                setDocumentId(doc.id);
                setCreateStatus("success");
            } else {
                throw new Error("Document created but ID not returned.");
            }

        } catch (err: any) {
            console.error("Upload failed", err);
            setCreateStatus("error");
            setCreateError(err.message || "An unexpected error occurred during upload.");
        }
    };

    const startFakeProgress = () => {
        setAnalysisProgress(5);
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

        progressIntervalRef.current = setInterval(() => {
            setAnalysisProgress((prev) => {
                if (prev >= 90) return prev;
                // Slow down as it gets higher
                const increment = prev < 50 ? 5 : 2;
                return prev + increment;
            });
        }, 800);
    };

    const stopFakeProgress = (finalValue: number) => {
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        setAnalysisProgress(finalValue);
    };

    const pollAnalysisStatus = async () => {
        if (!documentId || !token) return;

        try {

            const { document } = await getFullAnalysisStatus(documentId, token);
            // document_status in backend: PENDING, PROCESSING, READY, FAILED, UPLOADED
            const status = document.document_status;

            if (status === "READY" || status === "PREVIEW_READY") {
                stopFakeProgress(100);
                router.push(`/dashboard/documents/document-detail/${documentId}`);
            } else if (status === "FAILED") {
                setAnalysisStatus("failed");
                stopFakeProgress(100);
                setAnalysisError("Analysis failed on the server.");
            } else {
                // Still pending/processing
                // Poll again in 5 seconds
                pollTimeoutRef.current = setTimeout(pollAnalysisStatus, 5000);
            }
        } catch (err) {
            console.error("Polling error", err);
            // Retry on error
            pollTimeoutRef.current = setTimeout(pollAnalysisStatus, 5000);
        }
    };

    // Wrapper to ensure we have fresh state if needed, but for simplicity:
    const handlePoll = () => {
        pollAnalysisStatus();
    }

    const handleStartAnalysis = async () => {
        if (!documentId || !token) return;

        setAnalysisStatus("posting");
        setAnalysisError("");
        startFakeProgress();

        try {
            await startFullAnalysis(documentId, token);
            setAnalysisStatus("polling");

            // Wait 10 seconds before first poll
            pollTimeoutRef.current = setTimeout(handlePoll, 10000);

        } catch (err: any) {
            console.error("Start analysis failed", err);
            setAnalysisStatus("failed");
            stopFakeProgress(0);
            setAnalysisError(err.message || "Failed to start analysis.");
        }
    };

    // --- RENDER: Success / Analysis State UI ---
    if (createStatus === "success") {
        const isAnalyzing = analysisStatus === "posting" || analysisStatus === "polling";

        return (
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
                {/* Header */}
                <div className="space-y-2">
                    <Link
                        href="/dashboard/documents"
                        className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Documents
                    </Link>
                    <h1 className="text-3xl font-semibold text-white">Document Ready</h1>
                    <p className="text-green-400 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Upload successful! Your document is ready for processing.
                    </p>
                </div>

                {/* Success Card */}
                <div className="bg-[#0B0E14] border border-[#1F2937] rounded-xl p-12 flex flex-col items-center justify-center space-y-8 relative overflow-hidden">

                    {/* Background Progress Bar (Optional visual flare) */}
                    {isAnalyzing && (
                        <div className="absolute top-0 left-0 h-1 bg-indigo-600 transition-all duration-300" style={{ width: `${analysisProgress}%` }}></div>
                    )}

                    {/* Green Check Circle (Hidden if analyzing) */}
                    {!isAnalyzing && analysisStatus !== 'failed' && (
                        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                    )}

                    {/* Analyzing Spinner */}
                    {isAnalyzing && (
                        <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center animate-pulse">
                            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                        </div>
                    )}

                    {/* Failed Icon */}
                    {analysisStatus === 'failed' && (
                        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>
                    )}

                    {/* File Info Card */}
                    <div className="w-full max-w-md bg-[#111827] border border-[#374151] rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4 overflow-hidden">
                            <div className="w-10 h-10 rounded bg-indigo-500/20 flex items-center justify-center shrink-0">
                                <FileText className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {file?.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {file ? formatBytes(file.size) : ""} • PDF Document
                                </p>
                            </div>
                        </div>
                        <div className="px-2 py-1 bg-green-500/20 rounded text-[10px] font-semibold text-green-400 tracking-wider">
                            STORED
                        </div>
                    </div>

                    {/* Start Analysis Button */}
                    {analysisStatus === 'idle' || analysisStatus === 'failed' ? (
                        <div className="w-full max-w-md space-y-2">
                            <button
                                className={`w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-500/20 ${analysisStatus === 'failed' ? 'bg-red-600 hover:bg-red-500 shadow-red-500/20' : ''}`}
                                onClick={handleStartAnalysis}
                            >
                                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                                    <Play className={`w-3 h-3 fill-current ${analysisStatus === 'failed' ? 'text-red-600' : 'text-indigo-600'}`} />
                                </div>
                                {analysisStatus === 'failed' ? 'Retry Analysis' : 'Start Analysis'}
                            </button>
                            {analysisStatus === 'failed' && (
                                <p className="text-sm text-red-400 text-center">{analysisError}</p>
                            )}
                        </div>
                    ) : (
                        <div className="w-full max-w-md space-y-2">
                            <div className="w-full h-12 bg-[#1F2937] rounded-lg flex items-center px-4 relative overflow-hidden">
                                <div className="absolute inset-0 bg-indigo-900/20" style={{ width: `${analysisProgress}%`, transition: "width 0.5s ease" }}></div>
                                <span className="relative z-10 text-white text-sm font-medium flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Analyzing Document... {analysisProgress}%
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 text-center">
                                This might take a few moments. Please do not close this tab.
                            </p>
                        </div>
                    )}

                    {!isAnalyzing && analysisStatus !== 'failed' && (
                        <p className="text-xs text-gray-500">
                            Analysis typically takes less than 30 seconds for files under 10MB.
                        </p>
                    )}
                </div>
            </div>
        );
    }

    // --- Create / Upload State UI ---
    return (
        <div className="max-w-3xl mx-auto space-y-8">
            {/* Header */}
            <div className="space-y-1">
                <Link
                    href="/dashboard/documents"
                    className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Documents
                </Link>
                <h1 className="text-3xl font-semibold text-white">Add Document</h1>
                <p className="text-gray-400">
                    Upload a single PDF document to your collection.
                </p>
            </div>

            {/* Main Form Card */}
            <div className="bg-[#0B0E14] border border-[#1F2937] rounded-xl p-6 space-y-6">

                {/* Document File Section */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                        Document File
                    </label>

                    {!file ? (
                        <div
                            className="border-2 border-dashed border-[#374151] rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-500/50 hover:bg-[#111827]/50 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="w-12 h-12 rounded-full bg-[#1F2937] flex items-center justify-center mb-4">
                                <Upload className="w-6 h-6 text-gray-400" />
                            </div>
                            <p className="text-sm font-medium text-white">
                                Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                PDF (max 50MB)
                            </p>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="application/pdf"
                                onChange={handleFileSelect}
                            />
                        </div>
                    ) : (
                        <div className="bg-[#111827] border border-[#374151] rounded-lg p-4 flex items-center justify-between group">
                            <div className="flex items-center gap-4 overflow-hidden">
                                <div className="w-10 h-10 rounded bg-red-500/20 flex items-center justify-center shrink-0">
                                    <FileText className="w-5 h-5 text-red-500" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-white truncate">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {formatBytes(file.size)}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleRemoveFile}
                                className="p-2 text-gray-500 hover:text-white hover:bg-[#1F2937] rounded-lg transition-colors"
                                disabled={createStatus === "uploading"}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {createError && (
                        <p className="text-sm text-red-500 mt-2">
                            {createError}
                        </p>
                    )}
                </div>

                {/* Document Title Section */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                        Document Title (Optional)
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Q3 Financial Report"
                        className="w-full bg-[#0B0E14] border border-[#1F2937] rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                        disabled={createStatus === "uploading"}
                    />
                </div>

                {/* Action Button */}
                <button
                    onClick={handleFinishAndSave}
                    disabled={!file || createStatus === "uploading"}
                    className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 shadow-lg ${!file || createStatus === "uploading"
                        ? "bg-indigo-600/50 text-white/50 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25"
                        }`}
                >
                    {createStatus === "uploading" ? (
                        <span className="flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                            Uploading...
                        </span>
                    ) : (
                        "Finish & Save"
                    )}
                </button>

                <p className="text-xs text-center text-gray-600 mt-4">
                    Your document will be encrypted and processed for retrieval.
                </p>
            </div>
        </div>
    );
}
