"use client";

import { useEffect, useCallback, useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getStats, getRecentDocs, getEventLogs, clearOverviewState } from "@/features/documentsOverview/documentsOverviewSlice";
import { OverviewStatCard } from "@/components/overview/OverviewStatCard";
import { RecentDocumentsTable } from "@/components/overview/RecentDocumentsTable";
import { EventLogPanel } from "@/components/overview/EventLogPanel";
import { TextInput } from "@/components/ui/TextInput";
import { logout } from "@/features/auth/authSlice";

export default function DashboardOverviewPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { token } = useAppSelector((state) => state.auth);
    const { stats, recentDocuments, eventLog } = useAppSelector((state) => state.documentsOverview);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch Data
    useEffect(() => {
        if (!token) return;

        // Fetch stats and event logs only on mount
        if (debouncedSearch === "") {
            dispatch(getStats(token));
            dispatch(getEventLogs({ accessToken: token }));
        }

        // Fetch recent docs whenever search changes or on mount
        dispatch(getRecentDocs({ accessToken: token, search: debouncedSearch }));

    }, [dispatch, token, debouncedSearch]);

    // Cleanup
    useEffect(() => {
        return () => {
            dispatch(clearOverviewState());
        };
    }, [dispatch]);

    // Error Handling for 401
    useEffect(() => {
        const error = stats.error || recentDocuments.error || eventLog.error;
        if (error === "UNAUTHORIZED") {
            dispatch(logout()); // Clear token
            router.push("/login"); // Redirect
        }
    }, [stats.error, recentDocuments.error, eventLog.error, dispatch, router]);

    // Pagination Handlers
    const handleRecentDocsPage = useCallback((url: string | null) => {
        if (token && url) {
            dispatch(getRecentDocs({ accessToken: token, url }));
        }
    }, [dispatch, token]);

    const handleEventLogPage = useCallback((url: string | null) => {
        if (token && url) {
            dispatch(getEventLogs({ accessToken: token, url }));
        }
    }, [dispatch, token]);


    const statItems = [
        { label: "Total Documents", value: stats.data?.total_documents ?? 0 },
        { label: "Processing", value: stats.data?.processing ?? 0 },
        { label: "Ready", value: stats.data?.ready ?? 0 },
        { label: "Errors", value: stats.data?.errors ?? 0 }
    ];

    const showGlobalError = stats.error && stats.error !== "UNAUTHORIZED";

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-semibold text-white">Dashboard Overview</h1>
                <div className="w-full md:w-80">
                    <TextInput
                        placeholder="Search documents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-[#0B0E14] border-[#1F2937] text-white placeholder:text-gray-500"
                        leftIcon={<Search className="h-4 w-4 text-gray-500" />}
                    />
                </div>
            </div>

            {/* Error Message */}
            {showGlobalError && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {stats.error}
                </div>
            )}

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statItems.map((stat, index) => (
                    <OverviewStatCard
                        key={index}
                        label={stat.label}
                        value={stats.loading ? "-" : stat.value}
                        loading={stats.loading}
                    />
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
                {/* Recent Documents - Takes up 2 columns on large screens */}
                <div className="lg:col-span-2 h-full">
                    <RecentDocumentsTable
                        documents={recentDocuments.data}
                        loading={recentDocuments.loading}
                        count={recentDocuments.count}
                        next={recentDocuments.next}
                        previous={recentDocuments.previous}
                        onNext={() => handleRecentDocsPage(recentDocuments.next)}
                        onPrevious={() => handleRecentDocsPage(recentDocuments.previous)}
                        searchQuery={searchQuery}
                    />
                </div>

                {/* Event Log - Takes up 1 column on large screens */}
                <div className="lg:col-span-1 h-full">
                    <EventLogPanel
                        logs={eventLog.data}
                        loading={eventLog.loading}
                        next={eventLog.next}
                        previous={eventLog.previous}
                        onNext={() => handleEventLogPage(eventLog.next)}
                        onPrevious={() => handleEventLogPage(eventLog.previous)}
                    />
                </div>
            </div>
        </div>
    );
}
