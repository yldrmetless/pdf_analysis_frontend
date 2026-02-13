import { cn } from "@/lib/cn";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    leftIcon?: React.ReactNode;
};

export function TextInput({ className, leftIcon, ...props }: Props) {
    return (
        <div className={cn("relative", className)}>
            {leftIcon ? (
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35">
                    {leftIcon}
                </div>
            ) : null}
            <input
                {...props}
                className={cn(
                    "h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white/80 placeholder:text-white/35 outline-none transition",
                    leftIcon ? "pl-10" : "",
                    "focus:border-indigo-300/40 focus:ring-2 focus:ring-indigo-400/25"
                )}
            />
        </div>
    );
}
