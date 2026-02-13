import { EventLog } from "@/features/documentsOverview/documentsOverviewTypes";
import { cn } from "@/lib/cn";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface EventLogPanelProps {
    logs: EventLog[];
    loading?: boolean;
    next: string | null;
    previous: string | null;
    onNext: () => void;
    onPrevious: () => void;
}

export function EventLogPanel({
    logs,
    loading,
    next,
    previous,
    onNext,
    onPrevious
}: EventLogPanelProps) {
    if (loading && logs.length === 0) {
        return (
            <div className="p-6 rounded-xl bg-[#0B0E14] border border-[#1F2937] h-full animate-pulse">
                <div className="h-4 w-24 bg-gray-800 rounded mb-6" />
                <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-6 bg-gray-800 rounded w-full" />
                    ))}
                </div>
            </div>
        );
    }

    const getEventColor = (event: string) => {
        if (event.includes("READY") || event.includes("COMPLETE")) return "text-green-500";
        if (event.includes("ERROR") || event.includes("FAIL")) return "text-red-500";
        if (event.includes("PROCESSING") || event.includes("STARTED")) return "text-yellow-500";
        if (event.includes("QUEUED")) return "text-blue-500";
        return "text-indigo-400";
    };

    return (
        <div className={cn("p-6 rounded-xl bg-[#0B0E14] border border-[#1F2937] h-full flex flex-col", loading && "opacity-80 pointer-events-none")}>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">Event Log</h3>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 font-mono text-xs">
                {logs.length === 0 ? (
                    <div className="text-gray-500 text-center py-4">No events yet</div>
                ) : (
                    logs.map((log, index) => {
                        const timeStr = new Date(log.ts).toLocaleTimeString('tr-TR', { hour12: false });
                        return (
                            <div key={index} className="flex gap-3">
                                <span className="text-gray-500 text-xs">[{timeStr}]</span>
                                <span className={cn("font-semibold", getEventColor(log.event))}>
                                    {log.event}
                                </span>
                                <span className="text-gray-400 truncate flex-1" title={log.detail}>
                                    {log.detail}
                                </span>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-[#1F2937] flex items-center justify-between text-[10px] text-gray-500">
                <div className="flex items-center gap-2">
                    <button
                        onClick={onPrevious}
                        disabled={!previous || loading}
                        className="hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="h-3 w-3" />
                    </button>
                    <button
                        onClick={onNext}
                        disabled={!next || loading}
                        className="hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="h-3 w-3" />
                    </button>
                </div>

                <div className="flex items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <span>LISTENING</span>
                </div>
            </div>
        </div>
    );
}
