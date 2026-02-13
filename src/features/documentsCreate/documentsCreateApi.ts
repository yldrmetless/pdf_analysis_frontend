const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const uploadDocumentApi = async (accessToken: string, file: File, title?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    if (title) {
        formData.append("title", title);
    }

    const response = await fetch(`${API_URL}documents/create/`, {
        method: "POST",
        headers: {
            // Content-Type is set automatically with FormData
            "Authorization": `Bearer ${accessToken}`,
        },
        body: formData,
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error("UNAUTHORIZED");
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || `Failed to upload document: ${response.status}`);
    }

    return response.json();
};
