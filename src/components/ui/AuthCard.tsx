import { cn } from "@/lib/cn";

export function AuthCard({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                "w-full max-w-[420px] rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-xl",
                className
            )}
        >
            {children}
        </div>
    );
}
