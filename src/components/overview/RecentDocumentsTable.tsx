import { RecentDocument } from "@/features/documentsOverview/documentsOverviewTypes";
import { cn } from "@/lib/cn";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface RecentDocumentsTableProps {
    documents: RecentDocument[];
    loading?: boolean;
    next: string | null;
    previous: string | null;
    onNext: () => void;
    onPrevious: () => void;
    count: number;
}

export function RecentDocumentsTable({
    documents,
    loading,
    next,
    previous,
    onNext,
    onPrevious,
    count
}: RecentDocumentsTableProps) {
    if (loading && documents.length === 0) {
        return (
            <div className="p-6 rounded-xl bg-[#0B0E14] border border-[#1F2937] h-full animate-pulse">
                <div className="h-4 w-32 bg-gray-800 rounded mb-6" />
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-10 bg-gray-800 rounded w-full" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={cn("p-6 rounded-xl bg-[#0B0E14] border border-[#1F2937] h-full flex flex-col", loading && "opacity-80 pointer-events-none")}>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Recent Documents</h3>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total: {count}</span>
            </div>

            <div className="flex-1 overflow-x-auto">
                {documents.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                        No recent documents
                    </div>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-[#1F2937]">
                                <th className="pb-3 pl-2">Document Name</th>
                                <th className="pb-3 text-left">Status</th>
                                <th className="pb-3 text-right pr-2">Uploaded At</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1F2937]">
                            {documents.map((doc) => (
                                <tr key={doc.id} className="group hover:bg-white/5 transition-colors">
                                    <td className="py-3 pl-2 font-medium text-white">{doc.document_name}</td>
                                    <td className="py-3 text-gray-400 uppercase text-xs">{doc.status}</td>
                                    <td className="py-3 pr-2 text-right text-gray-500 text-xs">
                                        {new Date(doc.uploaded_at).toLocaleString('tr-TR', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination Controls */}
            <div className="mt-4 flex items-center justify-between border-t border-[#1F2937] pt-4">
                <button
                    onClick={onPrevious}
                    disabled={!previous || loading}
                    className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                </button>
                <button
                    onClick={onNext}
                    disabled={!next || loading}
                    className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Next
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
