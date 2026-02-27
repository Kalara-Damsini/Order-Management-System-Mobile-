const API_BASE_URL = "https://unserved-inexpressibly-francina.ngrok-free.dev";

export { API_BASE_URL };

export function resolveApiUrl(path) {
    if (!API_BASE_URL) return path || "";
    if (!path) return "";
    if (/^https?:\/\//i.test(path)) return path;

    const b = String(API_BASE_URL).replace(/\/+$/g, "");
    const p = String(path).replace(/^\/+/g, "");
    return `${b}/${p}`;
}
