"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/overview/DashboardSidebar";
import { DashboardMobileHeader } from "@/components/overview/DashboardMobileHeader";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#050814]">
            {/* Mobile Header */}
            <DashboardMobileHeader onToggleSidebar={() => setSidebarOpen(true)} />

            {/* Sidebar */}
            <DashboardSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main Content Area */}
            <main className="md:pl-64 pt-16 md:pt-0 min-h-screen">
                <div className="px-4 py-8 md:px-8 bg-[#050814]">
                    {children}
                </div>
            </main>
        </div>
    );
}
