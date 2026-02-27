import AsyncStorage from "@react-native-async-storage/async-storage";
import { httpGet, httpPatch, httpPost, httpPostMultipart } from "../../../shared/api/http";
import { resolveApiUrl } from "../../../shared/config/env";

// Small helper so we don't repeat this everywhere
function withAvatarFullUrl(data) {
  if (!data) return data;
  return {
    ...data,
    avatarFullUrl: data?.avatarUrl ? resolveApiUrl(data.avatarUrl) : null,
  };
}

export async function loginApi(email, password) {
  const data = await httpPost(
    "/auth/login",
    { email, password },
    { auth: false }
  );

  if (!data?.accessToken) {
    throw new Error("Login failed: accessToken not received");
  }

  await AsyncStorage.setItem("accessToken", data.accessToken);

  // Optional: if your backend later returns user in login response
  // return withAvatarFullUrl(data);

  return data;
}

export async function registerApi(fullName, email, password) {
  return httpPost(
    "/auth/register",
    { fullName, email, password },
    { auth: false }
  );
}

export async function logoutApi() {
  // If later you add backend logout, call it here.
  await AsyncStorage.removeItem("accessToken");
  return true;
}

// ✅ Get current user profile
export async function getMyProfileApi() {
  const data = await httpGet("/users/me", { auth: true });
  return withAvatarFullUrl(data);
}

// ✅ Update profile text fields (shopName)
export async function updateMyProfileApi(payload) {
  // payload example: { shopName: "My Shop" }
  const data = await httpPatch("/users/me", payload, { auth: true });
  return withAvatarFullUrl(data);
}

// ✅ Upload avatar image (multipart)
// Backend: POST /users/me/avatar  field: "file"
export async function uploadAvatarApi(fileUri) {
  if (!fileUri) throw new Error("File URI is required");

  const form = new FormData();

  // detect extension -> mime
  const ext = String(fileUri).split(".").pop()?.toLowerCase();
  const isPng = ext === "png";
  const isWebp = ext === "webp";

  const type = isPng ? "image/png" : isWebp ? "image/webp" : "image/jpeg";
  const name = `avatar.${isPng ? "png" : isWebp ? "webp" : "jpg"}`;

  form.append("file", {
    uri: fileUri,
    name,
    type,
  });

  const data = await httpPostMultipart("/users/me/avatar", form, { auth: true });

  // backend returns: { avatarUrl: "/uploads/avatars/xxx.jpg" }
  return withAvatarFullUrl(data);
}