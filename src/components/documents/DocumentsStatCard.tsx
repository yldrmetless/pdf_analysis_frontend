import { FileText, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

interface DocumentsStatCardProps {
    count: number;
    loading?: boolean;
}

export function DocumentsStatCard({ count, loading }: DocumentsStatCardProps) {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-[#0B0E14] p-6 border border-[#1F2937]">
            <div className="absolute right-0 top-0 h-32 w-32 -mr-8 -mt-8 rounded-full bg-indigo-500/5 blur-2xl" />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
                        <FileText className="h-5 w-5 text-indigo-400" />
                    </div>
                </div>

                <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-400">Total Documents</h3>
                    {loading ? (
                        <div className="flex items-center gap-2 h-9">
                            <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
                        </div>
                    ) : (
                        <div className="text-3xl font-bold text-white">
                            {count.toLocaleString()}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
