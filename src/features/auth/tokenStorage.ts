export const setTokens = (accessToken: string, refreshToken: string, expiresTime?: number) => {
    if (typeof window === "undefined") return;

    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    if (expiresTime) {
        localStorage.setItem("expires_time", expiresTime.toString());
        // Calculate absolute expiration time
        const expiresAt = Date.now() + expiresTime * 60 * 1000;
        localStorage.setItem("expires_at", expiresAt.toString());
    }
};

export const getTokens = () => {
    if (typeof window === "undefined") return { accessToken: null, refreshToken: null, expiresTime: null, expiresAt: null };

    const token = localStorage.getItem("access_token");
    const refresh = localStorage.getItem("refresh_token");
    const expTime = localStorage.getItem("expires_time");
    const expAt = localStorage.getItem("expires_at");

    return {
        accessToken: token,
        refreshToken: refresh,
        expiresTime: expTime ? Number(expTime) : null,
        expiresAt: expAt ? Number(expAt) : null
    };
};

export const clearTokens = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("expires_time");
    localStorage.removeItem("expires_at");
};
