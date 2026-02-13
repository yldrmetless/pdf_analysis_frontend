"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { AuthBackground } from "@/components/shared/AuthBackground";
import { AuthCard } from "@/components/ui/AuthCard";
import { TextInput } from "@/components/ui/TextInput";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Lock, User, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { login, resetAuth } from "@/features/auth/authSlice";

const LoginSchema = z.object({
    username_or_email: z.string().min(3, "Username or email is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof LoginSchema>;

export default function LoginPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(LoginSchema),
    });

    // Handle successful login redirect
    useEffect(() => {
        if (isAuthenticated) {
            router.push("/dashboard/overview");
        }
    }, [isAuthenticated, router]);

    // Clean up on unmount
    useEffect(() => {
        return () => {
            dispatch(resetAuth());
        };
    }, [dispatch]);

    const onSubmit = async (data: LoginFormValues) => {
        try {
            await dispatch(login(data)).unwrap();
            // Redirect handled by useEffect
        } catch (err) {
            // Error handled by Redux state
        }
    };

    return (
        <main className="relative min-h-screen text-white">
            <AuthBackground />

            <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-12">
                <AuthCard>
                    <div className="flex items-center justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 ring-1 ring-indigo-400/20">
                            <Sparkles className="h-6 w-6 text-indigo-100" />
                        </div>
                    </div>

                    <div className="mt-5 text-center">
                        <div className="flex items-center justify-center gap-2 text-sm font-semibold text-white/85">
                            <span>DocuMind AI</span>
                        </div>
                        <h1 className="mt-4 text-2xl font-semibold tracking-tight">Welcome back</h1>
                        <p className="mt-2 text-sm text-white/55">Enter your credentials to access your workspace.</p>
                    </div>

                    {error && (
                        <div className="mt-6 flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-200">
                            <AlertCircle className="h-5 w-5 shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label className="mb-2 block text-xs font-medium tracking-wide text-white/55">
                                Username or Email
                            </label>
                            <TextInput
                                placeholder="name@company.com"
                                autoComplete="username"
                                leftIcon={<User className="h-4 w-4" />}
                                {...register("username_or_email")}
                            />
                            {errors.username_or_email && (
                                <p className="mt-1 text-xs text-rose-400">{errors.username_or_email.message}</p>
                            )}
                        </div>

                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label className="block text-xs font-medium tracking-wide text-white/55">Password</label>
                                <Link href="#" className="text-xs text-indigo-300/90 hover:text-indigo-200">
                                    Forgot password?
                                </Link>
                            </div>
                            <TextInput
                                type="password"
                                placeholder="••••••••"
                                autoComplete="current-password"
                                leftIcon={<Lock className="h-4 w-4" />}
                                {...register("password")}
                            />
                            {errors.password && (
                                <p className="mt-1 text-xs text-rose-400">{errors.password.message}</p>
                            )}
                        </div>

                        <PrimaryButton type="submit" disabled={loading}>
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Signing In...</span>
                                </div>
                            ) : (
                                "Sign In to Console"
                            )}
                        </PrimaryButton>

                        <div className="pt-4 text-center text-sm text-white/50">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="text-indigo-300/90 hover:text-indigo-200">
                                Sign up
                            </Link>
                        </div>

                        <div className="pt-8 text-center text-[11px] tracking-wide text-white/30">
                            © 2024 DocuMind AI. Secure Console Access.
                        </div>
                    </form>
                </AuthCard>
            </div>
        </main>
    );
}
