import { ArrowLeft, RefreshCw, Trash2, FileText, Lightbulb } from "lucide-react";
import Link from "next/link";
import { formatBytes } from "@/lib/fileFormat";

interface DocumentAnalysisHeaderProps {
    title: string;
    originalName: string;
    createdAt: string;
    fileSize: number;
    mimeType?: string;
    pageCount: number | null;
    status: string;
    onDelete?: () => void;
    onShowSuggestions?: () => void;
}

export function DocumentAnalysisHeader({
    title,
    originalName,
    createdAt,
    fileSize,
    mimeType = "application/pdf",
    pageCount,
    status,
    onDelete,
    onShowSuggestions,
}: DocumentAnalysisHeaderProps) {

    const getStatusBadgeClasses = (status: string) => {
        // Normalize status check
        const s = status.toUpperCase();

        if (s === "READY" || s === "PREVIEW_READY") {
            return "bg-emerald-900/30 text-emerald-400 border-emerald-800";
        }
        if (s === "PENDING" || s === "PROCESSING" || s === "UPLOADED") {
            return "bg-yellow-900/30 text-yellow-400 border-yellow-800";
        }
        if (s === "FAILED") {
            return "bg-red-900/30 text-red-400 border-red-800";
        }
        // Default
        return "bg-gray-800 text-gray-400 border-gray-700";
    };

    const formatDate = (isoString?: string) => {
        if (!isoString) return "-";
        try {
            return new Date(isoString).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch (e) {
            return isoString;
        }
    };

    return (
        <div className="space-y-3 sm:space-y-6">
            {/* Nav Back */}
            <div>
                <Link
                    href="/dashboard/documents"
                    className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Documents
                </Link>
            </div>

            {/* Header Content */}
            <div className="bg-[#0B0E14] border border-[#1F2937] rounded-xl p-4 sm:p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">

                    {/* Left: Icon & Title & Metadata */}
                    <div className="flex gap-4 overflow-hidden">
                        <div className="w-12 h-12 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                            <FileText className="w-6 h-6 text-red-500" />
                        </div>

                        <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                <h1 className="text-lg sm:text-xl font-semibold text-white truncate max-w-full" title={title || originalName}>
                                    {originalName}
                                </h1>
                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border whitespace-nowrap shrink-0 ${getStatusBadgeClasses(status)}`}>
                                    {status}
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                                <span className="whitespace-nowrap">Uploaded: <span className="text-gray-400">{formatDate(createdAt)}</span></span>
                                <span className="hidden sm:inline w-1 h-1 rounded-full bg-gray-700"></span>
                                <span className="whitespace-nowrap">Size: <span className="text-gray-400">{formatBytes(fileSize)}</span></span>
                                <span className="hidden sm:inline w-1 h-1 rounded-full bg-gray-700"></span>
                                <span className="whitespace-nowrap">MIME: <span className="text-gray-400">{mimeType}</span></span>
                                <span className="hidden sm:inline w-1 h-1 rounded-full bg-gray-700"></span>
                                <span className="whitespace-nowrap">Pages: <span className="text-gray-400">{pageCount ?? "-"}</span></span>
                            </div>

                            {/* Title Subtitle if needed */}
                            {title && title !== originalName && (
                                <p className="text-sm text-gray-400 mt-1 truncate">{title}</p>
                            )}
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                        {onShowSuggestions && (
                            <button
                                onClick={onShowSuggestions}
                                className="cursor-pointer flex items-center justify-center gap-2 px-3   py-2 sm:py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-lg text-sm sm:text-xs font-medium text-indigo-300 transition-colors w-full sm:w-auto"
                            >
                                <Lightbulb className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                                Show Suggestions
                            </button>
                        )}

                        <button
                            onClick={onDelete}
                            className="cursor-pointer flex items-center justify-center gap-2 px-3 py-2 sm:py-1.5 bg-red-900/20 hover:bg-red-900/30 border border-red-900/30 rounded-lg text-sm sm:text-xs font-medium text-red-400 transition-colors w-full sm:w-auto"
                        >
                            <Trash2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                            Delete Document
                        </button>
                    </div>
                </div>
            </div>

            {/* Placeholder for Body Content */}
            {/* <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-600">
                Body content not implemented yet.
            </div> */}
        </div>
    );
}
