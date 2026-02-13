import { cn } from "@/lib/cn";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function PrimaryButton({ className, ...props }: Props) {
    return (
        <button
            {...props}
            className={cn(
                "inline-flex h-11 w-full items-center justify-center rounded-xl bg-indigo-500 text-sm font-medium text-white shadow-[0_12px_30px_-12px_rgba(99,102,241,0.65)] transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300/50 disabled:cursor-not-allowed disabled:opacity-60",
                className
            )}
        />
    );
}
