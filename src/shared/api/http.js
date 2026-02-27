import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../shared/config/env";

function joinUrl(base, path) {
  if (!base) return path;
  if (!path) return base;
  const b = String(base).replace(/\/+$/g, "");
  const p = String(path).replace(/^\/+/g, "");
  return `${b}/${p}`;
}

export async function httpGet(path, options = {}) {
  const { auth = true } = options;

  if (!API_BASE_URL) {
    throw new Error(
      "API_BASE_URL is undefined. Fix shared/config/env.js and restart Metro (expo start -c).",
    );
  }
  if (typeof path !== "string" || !path.length) {
    throw new Error("Invalid API path (empty).");
  }

  const token = auth ? await AsyncStorage.getItem("accessToken") : null;
  const url = joinUrl(API_BASE_URL, path);

  console.log("GET URL =", url);

  let res;
  try {
    res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  } catch (err) {
    console.error("NETWORK ERROR:", err);
    throw new Error(
      "Network request failed. If using a real phone, don't use localhost—use your PC IP (e.g., http://192.168.x.x:3000).",
    );
  }

  const text = await res.text();
  const data = safeJson(text);

  console.log("GET STATUS =", res.status);
  console.log("GET RESPONSE =", data);

  if (!res.ok) {
    const msg =
      (Array.isArray(data?.message)
        ? data.message.join("\n")
        : data?.message) ||
      (data?.raw ? String(data.raw) : null) ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data;
}

export async function httpPost(path, body, options = {}) {
  const { auth = true } = options;

  if (!API_BASE_URL) {
    throw new Error(
      "API_BASE_URL is undefined. Fix shared/config/env.js and restart Metro (expo start -c).",
    );
  }
  if (typeof path !== "string" || !path.length) {
    throw new Error("Invalid API path (empty).");
  }

  const token = auth ? await AsyncStorage.getItem("accessToken") : null;
  const url = joinUrl(API_BASE_URL, path);

  console.log("POST URL =", url);

  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body == null ? undefined : JSON.stringify(body),
    });
  } catch (err) {
    console.error("NETWORK ERROR:", err);
    throw new Error(
      "Network request failed. If using a real phone, don't use localhost—use your PC IP (e.g., http://192.168.x.x:3000).",
    );
  }

  const text = await res.text();
  const data = safeJson(text);

  console.log("POST STATUS =", res.status);
  console.log("POST RESPONSE =", data);

  if (!res.ok) {
    const msg =
      (Array.isArray(data?.message)
        ? data.message.join("\n")
        : data?.message) ||
      (typeof data === "string" ? data : null) ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data;
}

export async function httpPatch(path, body, options = {}) {
  const { auth = true } = options;

  if (!API_BASE_URL)
    throw new Error(
      "API_BASE_URL is undefined. Fix env and restart Metro (expo start -c).",
    );
  if (typeof path !== "string" || !path.length)
    throw new Error("Invalid API path (empty).");

  const token = auth ? await AsyncStorage.getItem("accessToken") : null;
  const url = joinUrl(API_BASE_URL, path);

  console.log("PATCH URL =", url);

  let res;
  try {
    res = await fetch(url, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body == null ? undefined : JSON.stringify(body),
    });
  } catch (err) {
    console.error("NETWORK ERROR:", err);
    throw new Error(
      "Network request failed. Check API_BASE_URL and backend running.",
    );
  }

  const text = await res.text();
  const data = safeJson(text);

  console.log("PATCH STATUS =", res.status);
  console.log("PATCH RESPONSE =", data);

  if (!res.ok) {
    const msg =
      (Array.isArray(data?.message)
        ? data.message.join("\n")
        : data?.message) ||
      (data?.raw ? String(data.raw) : null) ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data;
}

export async function httpDelete(path, options = {}) {
  const { auth = true } = options;

  if (!API_BASE_URL)
    throw new Error(
      "API_BASE_URL is undefined. Fix env and restart Metro (expo start -c).",
    );
  if (typeof path !== "string" || !path.length)
    throw new Error("Invalid API path (empty).");

  const token = auth ? await AsyncStorage.getItem("accessToken") : null;
  const url = joinUrl(API_BASE_URL, path);

  console.log("DELETE URL =", url);

  let res;
  try {
    res = await fetch(url, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  } catch (err) {
    console.error("NETWORK ERROR:", err);
    throw new Error(
      "Network request failed. Check API_BASE_URL and backend running.",
    );
  }

  // ✅ handle No Content
  if (res.status === 204) {
    console.log("DELETE STATUS =", res.status, "(No Content)");
    return { success: true };
  }

  // ✅ handle possible empty body even with 200
  const text = await res.text();
  if (!text) {
    console.log("DELETE STATUS =", res.status, "(Empty Body)");
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    return { success: true };
  }

  const data = safeJson(text);

  console.log("DELETE STATUS =", res.status);
  console.log("DELETE RESPONSE =", data);

  if (!res.ok) {
    const msg =
      (Array.isArray(data?.message)
        ? data.message.join("\n")
        : data?.message) ||
      (data?.raw ? String(data.raw) : null) ||
      (typeof data === "string" ? data : null) ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data ?? { success: true };
}

// For uploading proof images (FormData)
// NOTE: do NOT set Content-Type manually (fetch will set boundary)
export async function httpPostMultipart(path, formData, options = {}) {
  const { auth = true } = options;

  if (!API_BASE_URL)
    throw new Error(
      "API_BASE_URL is undefined. Fix env and restart Metro (expo start -c).",
    );
  if (typeof path !== "string" || !path.length)
    throw new Error("Invalid API path (empty).");

  const token = auth ? await AsyncStorage.getItem("accessToken") : null;
  const url = joinUrl(API_BASE_URL, path);

  console.log("MULTIPART POST URL =", url);

  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
  } catch (err) {
    console.error("NETWORK ERROR:", err);
    throw new Error(
      "Network request failed. Check API_BASE_URL and backend running.",
    );
  }

  const text = await res.text();
  const data = safeJson(text);

  console.log("MULTIPART STATUS =", res.status);
  console.log("MULTIPART RESPONSE =", data);

  if (!res.ok) {
    const msg =
      (Array.isArray(data?.message)
        ? data.message.join("\n")
        : data?.message) ||
      (data?.raw ? String(data.raw) : null) ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data;
}

function safeJson(text) {
  if (text == null || text === "") return null;
  try {
    return JSON.parse(text);
    // eslint-disable-next-line no-unused-vars
  } catch (e) {
    // If response is not valid JSON, return raw text for higher-level handling
    return text;
  }
}
