import { Document } from "@/features/documents/documentsTypes";
import { cn } from "@/lib/cn";
import { ChevronLeft, ChevronRight, Eye, Trash, FileText, FileCode, FileSpreadsheet } from "lucide-react";
import { formatBytes } from "@/lib/utils";

interface DocumentsTableProps {
    documents: Document[];
    loading?: boolean;
    count: number;
    next: string | null;
    previous: string | null;
    onNext: () => void;
    onPrevious: () => void;
    startIndex: number;
}

export function DocumentsTable({
    documents,
    loading,
    count,
    next,
    previous,
    onNext,
    onPrevious,
    startIndex
}: DocumentsTableProps) {
    if (loading && documents.length === 0) {
        return (
            <div className="rounded-xl bg-[#0B0E14] border border-[#1F2937] p-6 animate-pulse">
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-12 bg-gray-800 rounded w-full" />
                    ))}
                </div>
            </div>
        );
    }

    const getFileIcon = (mimeType: string) => {
        if (mimeType.includes("pdf")) return <FileText className="h-5 w-5 text-rose-400" />;
        if (mimeType.includes("word") || mimeType.includes("document")) return <FileText className="h-5 w-5 text-blue-400" />;
        if (mimeType.includes("sheet") || mimeType.includes("excel")) return <FileSpreadsheet className="h-5 w-5 text-green-400" />;
        return <FileCode className="h-5 w-5 text-gray-400" />;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "READY": return "bg-green-500/10 text-green-400 border-green-500/20";
            case "PROCESSING": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
            case "ERROR": return "bg-red-500/10 text-red-400 border-red-500/20";
            default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
        }
    };

    const endIndex = Math.min(startIndex + documents.length, count);
    const showingText = count > 0 ? `Showing ${startIndex + 1}-${endIndex} of ${count} documents` : "No documents";

    return (
        <div className={cn("flex flex-col h-full bg-[#0B0E14] border border-[#1F2937] rounded-xl overflow-hidden", loading && "opacity-80 pointer-events-none")}>
            <div className="flex-1 overflow-x-auto">
                {documents.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-gray-500">
                        <FileText className="h-12 w-12 mb-4 opacity-20" />
                        <p>No documents yet</p>
                    </div>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#11141D] border-b border-[#1F2937]">
                            <tr>
                                <th className="px-6 py-4 font-medium text-gray-400 uppercase text-xs tracking-wider">Name</th>
                                <th className="px-6 py-4 font-medium text-gray-400 uppercase text-xs tracking-wider">Status</th>
                                <th className="px-6 py-4 font-medium text-gray-400 uppercase text-xs tracking-wider">Size</th>
                                <th className="px-6 py-4 font-medium text-gray-400 uppercase text-xs tracking-wider">Uploaded</th>
                                <th className="px-6 py-4 font-medium text-gray-400 uppercase text-xs tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1F2937] cursor-pointer">
                            {documents.map((doc) => (
                                <tr key={doc.id} className="group hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded bg-gray-800/50">
                                                {getFileIcon(doc.mime_type)}
                                            </div>
                                            <span className="font-medium text-white max-w-[200px] truncate" title={doc.original_name}>
                                                {doc.original_name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium border", getStatusColor(doc.status))}>
                                            {doc.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 font-mono text-xs">
                                        {formatBytes(doc.file_size)}
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-xs">
                                        {new Date(doc.created_at).toLocaleString(undefined, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            className="cursor-pointer p-1.5 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            title="Coming soon"

                                        >
                                            <Trash className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination Controls */}
            <div className="px-6 py-4 border-t border-[#1F2937] bg-[#0B0E14] flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-sm text-gray-500">
                    {showingText}
                </span>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onPrevious}
                        disabled={!previous || loading}
                        className="px-3 py-1.5 flex items-center gap-1 text-sm font-medium text-gray-400 bg-[#11141D] border border-[#1F2937] rounded-lg hover:text-white hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </button>
                    <button
                        onClick={onNext}
                        disabled={!next || loading}
                        className="px-3 py-1.5 flex items-center gap-1 text-sm font-medium text-gray-400 bg-[#11141D] border border-[#1F2937] rounded-lg hover:text-white hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
