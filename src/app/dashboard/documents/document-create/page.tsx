"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, UploadCloud, File as FileIcon, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { uploadDocument, resetDocumentsCreateState } from "@/features/documentsCreate/documentsCreateSlice";
import { formatBytes } from "@/lib/utils";
import { TextInput } from "@/components/ui/TextInput";
import { clearDocumentsState } from "@/features/documents/documentsSlice"; // To invalidate cache

export default function DocumentCreatePage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { token } = useAppSelector((state) => state.auth);
    const { uploading, error, success } = useAppSelector((state) => state.documentsCreate);

    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [dragActive, setDragActive] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            dispatch(resetDocumentsCreateState());
        };
    }, [dispatch]);

    useEffect(() => {
        if (success) {
            // Invalidate documents list cache so next visit fetches new data
            dispatch(clearDocumentsState());
            router.push("/dashboard/documents");
        }
    }, [success, dispatch, router]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (selectedFile: File) => {
        setLocalError(null);
        if (selectedFile.type !== "application/pdf") {
            setLocalError("Only PDF files are allowed.");
            return;
        }
        if (selectedFile.size > 50 * 1024 * 1024) { // 50MB
            setLocalError("File size must be less than 50MB.");
            return;
        }
        setFile(selectedFile);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleUpload = () => {
        if (!file || !token) return;
        dispatch(uploadDocument({ accessToken: token, file, title: title.trim() || undefined }));
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] w-full px-4 md:px-10 py-10 flex flex-col items-center">

            {/* Header */}
            <div className="w-full max-w-3xl mb-8">
                <Link
                    href="/dashboard/documents"
                    className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-4 text-sm font-medium"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Documents
                </Link>
                <h1 className="text-3xl font-semibold text-white mb-2">Add Document</h1>
                <p className="text-gray-400">Upload a single PDF document to your collection.</p>
            </div>

            {/* Main Card */}
            <div className="w-full max-w-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <div className="relative z-10 space-y-8">

                    {/* File Dropzone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Document File</label>
                        {!file ? (
                            <div
                                className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${dragActive ? "border-indigo-500 bg-indigo-500/10" : "border-gray-700 hover:border-indigo-500/50 hover:bg-white/5"
                                    }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                />
                                <div className="h-12 w-12 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400">
                                    <FileIcon className="h-6 w-6" />
                                </div>
                                <p className="text-white font-medium mb-1">Select PDF file</p>
                                <p className="text-xs text-gray-500">Max file size: 50MB</p>
                            </div>
                        ) : (
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4 overflow-hidden">
                                    <div className="h-10 w-10 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400 flex-shrink-0">
                                        <FileIcon className="h-5 w-5" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-white text-sm font-medium truncate">{file.name}</p>
                                        <p className="text-gray-500 text-xs">{formatBytes(file.size)}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleRemoveFile}
                                    className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                                    disabled={uploading}
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                        {localError && <p className="mt-2 text-sm text-red-400">{localError}</p>}
                    </div>

                    {/* Title Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Document Title (Optional)</label>
                        <input
                            type="text"
                            placeholder="e.g. Q3 Financial Report"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={uploading}
                            className="w-full bg-[#0B0E14] border border-[#1F2937] text-white placeholder:text-gray-500 rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50"
                        />
                    </div>

                    {/* Upload Button & Error */}
                    <div className="space-y-4">
                        {(error) && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleUpload}
                            disabled={!file || uploading}
                            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-indigo-500/30"
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <UploadCloud className="h-5 w-5" />
                                    Upload Document
                                </>
                            )}
                        </button>
                    </div>

                </div>
            </div>

            <div className="mt-8 text-center">
                <p className="text-xs text-gray-600">Your document will be encrypted and processed for retrieval.</p>
            </div>
        </div>
    );
}
