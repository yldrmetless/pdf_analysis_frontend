"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    FileText,
    Settings,
    LogOut,
    X,
    CreditCard
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/features/auth/authSlice";
import { fetchProfile } from "@/features/profile/profileSlice";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function DashboardSidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const { user, token } = useAppSelector((state) => state.auth);
    // Also check local storage for token if not in state (though authSlice should handle this via hydration)
    const { data: profile, loading } = useAppSelector((state) => state.profile);

    useEffect(() => {
        if (token && !profile && !loading) {
            dispatch(fetchProfile(token));
        }
    }, [dispatch, token, profile, loading]);

    const navItems = [
        {
            label: "Overview",
            href: "/dashboard/overview",
            icon: LayoutDashboard,
        },
        {
            label: "Documents",
            href: "/dashboard/documents",
            icon: FileText,
        }
    ];

    const router = useRouter(); // Ensure this is available in scope

    const handleLogout = () => {
        dispatch(logout());
        onClose(); // Close mobile sidebar if open
        router.replace("/login");
    };

    const SidebarContent = () => (
        <div className="flex h-full flex-col bg-[#0B0E14] border-r border-[#1F2937]">
            {/* Logo Area */}
            <div className="flex h-16 items-center px-6 border-b border-[#1F2937]">
                <div className="flex items-center gap-2 font-semibold text-white">
                    <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-white" />
                    </div>
                    <span>DocuMind AI</span>
                </div>
                {/* Mobile Close Button */}
                <button
                    onClick={onClose}
                    className="ml-auto md:hidden text-gray-400 hover:text-white"
                >
                    <X className="h-6 w-6" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => onClose()} // Close sidebar on mobile when link clicked
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-indigo-500/10 text-indigo-400"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5", isActive ? "text-indigo-400" : "text-gray-500")} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile Section */}
            <div className="p-4 border-t border-[#1F2937]">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-200 font-medium">
                        {profile?.first_name?.[0] || user?.username?.[0] || "U"}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-medium text-white truncate">
                            {profile ? `${profile.first_name} ${profile.last_name}` : "Loading..."}
                        </span>
                        <span className="text-xs text-gray-500 truncate">
                            @{profile?.username || "username"}
                        </span>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex cursor-pointer w-full items-center gap-2 px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                    <LogOut className="h-4 w-4" />
                    Sign out
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar - Always Visible */}
            <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-50">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar - Drawer */}
            <div className={cn("fixed inset-0 z-50 md:hidden", isOpen ? "block" : "hidden")}>
                {/* Overlay */}
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />

                {/* Sidebar Panel */}
                <div className={cn(
                    "fixed inset-y-0 left-0 w-64 bg-[#0B0E14] shadow-xl transition-transform duration-300 ease-in-out transform",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}>
                    <SidebarContent />
                </div>
            </div>
        </>
    );
}
