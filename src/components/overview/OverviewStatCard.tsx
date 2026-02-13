import { cn } from "@/lib/cn";

interface OverviewStatCardProps {
    label: string;
    value: number | string;
    className?: string;
    loading?: boolean;
}

export function OverviewStatCard({ label, value, className, loading }: OverviewStatCardProps) {
    if (loading) {
        return (
            <div className={cn("p-6 rounded-xl bg-[#0B0E14] border border-[#1F2937] animate-pulse", className)}>
                <div className="h-3 w-24 bg-gray-800 rounded mb-4" />
                <div className="h-8 w-16 bg-gray-800 rounded" />
            </div>
        );
    }

    return (
        <div className={cn("p-6 rounded-xl bg-[#0B0E14] border border-[#1F2937]", className)}>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {label}
            </div>
            <div className="text-3xl font-bold text-white">
                {value}
            </div>
        </div>
    );
}
