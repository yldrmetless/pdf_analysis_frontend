"use client";

import { Menu } from "lucide-react";

interface MobileHeaderProps {
    onToggleSidebar: () => void;
}

export function DashboardMobileHeader({ onToggleSidebar }: MobileHeaderProps) {
    return (
        <header className="sticky top-0 z-40 flex h-16 w-full items-center border-b border-[#1F2937] bg-[#0B0E14] px-4 md:hidden">
            <button
                onClick={onToggleSidebar}
                className="mr-4 text-gray-400 hover:text-white focus:outline-none"
                aria-label="Toggle sidebar"
            >
                <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-2 font-semibold text-white">
                <span>DocuMind AI App</span>
            </div>
        </header>
    );
}
