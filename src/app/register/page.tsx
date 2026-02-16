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
import { AtSign, Lock, Mail, Sparkles, User, Loader2, AlertCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { register, resetAuth } from "@/features/auth/authSlice";

// Shared Zod schema (could be moved to shared file if reused)
export const RegisterSchema = z.object({
    first_name: z.string().min(2, "First name must be at least 2 characters"),
    last_name: z.string().min(2, "Last name must be at least 2 characters"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

type RegisterFormValues = z.infer<typeof RegisterSchema>;

export default function RegisterPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { loading, error, registrationSuccess } = useAppSelector((state) => state.auth);

    const {
        register: registerField,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(RegisterSchema),
    });

    // Handle successful registration redirect
    useEffect(() => {
        if (registrationSuccess) {
            dispatch(resetAuth());
            router.push("/login");
        }
    }, [registrationSuccess, router, dispatch]);

    // Clean up on unmount
    useEffect(() => {
        return () => {
            dispatch(resetAuth());
        };
    }, [dispatch]);

    const onSubmit = (data: RegisterFormValues) => {
        dispatch(register(data));
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
                        <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
                        <p className="mt-2 text-sm text-white/55">Join the open-source document intelligence platform.</p>
                    </div>

                    {error && (
                        <div className="mt-6 flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-200">
                            <AlertCircle className="h-5 w-5 shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label className="mb-2 block text-xs font-medium tracking-wide text-white/55">FIRST NAME</label>
                            <TextInput
                                placeholder="Alice"
                                autoComplete="given-name"
                                leftIcon={<User className="h-4 w-4" />}
                                {...registerField("first_name")}
                            />
                            {errors.first_name && (
                                <p className="mt-1 text-xs text-rose-400">{errors.first_name.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-medium tracking-wide text-white/55">LAST NAME</label>
                            <TextInput
                                placeholder="Smith"
                                autoComplete="family-name"
                                leftIcon={<User className="h-4 w-4" />}
                                {...registerField("last_name")}
                            />
                            {errors.last_name && (
                                <p className="mt-1 text-xs text-rose-400">{errors.last_name.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-medium tracking-wide text-white/55">USERNAME</label>
                            <TextInput
                                placeholder="dev_engineer"
                                autoComplete="username"
                                leftIcon={<AtSign className="h-4 w-4" />}
                                {...registerField("username")}
                            />
                            {errors.username && (
                                <p className="mt-1 text-xs text-rose-400">{errors.username.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-medium tracking-wide text-white/55">EMAIL ADDRESS</label>
                            <TextInput
                                placeholder="you@company.com"
                                autoComplete="email"
                                leftIcon={<Mail className="h-4 w-4" />}
                                {...registerField("email")}
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-rose-400">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-medium tracking-wide text-white/55">PASSWORD</label>
                            <TextInput
                                type="password"
                                placeholder="••••••••"
                                autoComplete="new-password"
                                leftIcon={<Lock className="h-4 w-4" />}
                                {...registerField("password")}
                            />
                            {errors.password && (
                                <p className="mt-1 text-xs text-rose-400">{errors.password.message}</p>
                            )}
                        </div>

                        <PrimaryButton type="submit" disabled={loading} className="flex items-center justify-center gap-2">
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Creating Account...</span>
                                </>
                            ) : (
                                <>
                                    <span>Create Developer Account</span>
                                    <span aria-hidden className="text-white/85">→</span>
                                </>
                            )}
                        </PrimaryButton>

                        <div className="pt-4 text-center text-sm text-white/50">
                            Already have an account?{" "}
                            <Link href="/login" className="text-indigo-300/90 hover:text-indigo-200">
                                Log in
                            </Link>
                        </div>

                        <div className="pt-8 text-center text-[11px] tracking-wide text-white/30">
                            DocuMind AI APP v2.0.4 • Secure 256-bit Encryption
                        </div>
                    </form>
                </AuthCard>
            </div>
        </main>
    );
}
