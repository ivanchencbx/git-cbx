export const getApiUrl = () => {
    if (typeof window === "undefined") {
        // Server-side rendering - default to localhost or env var
        return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    }

    // Client-side: dynamic detection
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;

    // If running on localhost/127.0.0.1, assume backend is on port 8000
    // If running on a LAN IP (e.g. 192.168.x.x), assume backend is also on that IP :8000
    // In production, this might need adjustment (e.g. /api proxy), but for now this enables mobile testing
    return `${protocol}//${hostname}:8000`;
};

export const apiClient = {
    async post(endpoint: string, data: any, isJson = true) {
        const baseUrl = getApiUrl();
        const headers: HeadersInit = {};
        if (isJson) {
            headers["Content-Type"] = "application/json";
        }

        // Add auth token if exists
        const token = localStorage.getItem("cbx_token");
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const config: RequestInit = {
            method: "POST",
            headers,
            body: isJson ? JSON.stringify(data) : data,
        };

        const res = await fetch(`${baseUrl}${endpoint}`, config);
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ detail: res.statusText }));
            throw new Error(errorData.detail || `Request failed: ${res.status}`);
        }
        return res.json();
    },

    async get(endpoint: string) {
        const baseUrl = getApiUrl();
        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };

        const token = localStorage.getItem("cbx_token");
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(`${baseUrl}${endpoint}`, { headers });
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ detail: res.statusText }));
            throw new Error(errorData.detail || `Request failed: ${res.status}`);
        }
        return res.json();
    },

    async put(endpoint: string, data: any) {
        const baseUrl = getApiUrl();
        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };

        const token = localStorage.getItem("cbx_token");
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(`${baseUrl}${endpoint}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ detail: res.statusText }));
            throw new Error(errorData.detail || `Request failed: ${res.status}`);
        }
        return res.json();
    },

    async patch(endpoint: string, data: any) {
        const baseUrl = getApiUrl();
        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };

        const token = localStorage.getItem("cbx_token");
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(`${baseUrl}${endpoint}`, {
            method: "PATCH",
            headers,
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ detail: res.statusText }));
            throw new Error(errorData.detail || `Request failed: ${res.status}`);
        }
        return res.json();
    },

    async delete(endpoint: string) {
        const baseUrl = getApiUrl();
        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };

        const token = localStorage.getItem("cbx_token");
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(`${baseUrl}${endpoint}`, {
            method: "DELETE",
            headers,
        });
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ detail: res.statusText }));
            throw new Error(errorData.detail || `Request failed: ${res.status}`);
        }
        return res.json();
    }
};
