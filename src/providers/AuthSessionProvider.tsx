"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { hydrateAuth, logout } from "@/features/auth/authSlice";
import { getTokens } from "@/features/auth/tokenStorage";

export default function AuthSessionProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const pathname = usePathname();
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        const { accessToken, refreshToken, expiresTime, expiresAt } = getTokens();

        if (accessToken && refreshToken && expiresTime && expiresAt) {
            const now = Date.now();

            if (now >= expiresAt) {
                // Token expired
                dispatch(logout());
                router.replace("/login");
            } else {
                // Valid token, hydrate and schedule logout
                dispatch(hydrateAuth({ accessToken, refreshToken, expiresTime, expiresAt }));

                const timeRemaining = expiresAt - now;
                const timeoutId = setTimeout(() => {
                    dispatch(logout());
                    router.replace("/login");
                }, timeRemaining);

                setIsHydrated(true);
                return () => clearTimeout(timeoutId);
            }
        } else {
            // No tokens or incomplete tokens
            setIsHydrated(true);
        }
    }, [dispatch, router, pathname]);

    // Optionally prevent rendering until hydration check is complete if strict protection is needed.
    // For now, we render children immediately but could show a loading spinner.

    return <>{children}</>;
}
