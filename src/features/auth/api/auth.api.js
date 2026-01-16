import AsyncStorage from "@react-native-async-storage/async-storage";
import { httpPost } from "../../../shared/api/http";

export async function loginApi(email, password) {
  const data = await httpPost("/auth/login", { email, password }, { auth: false });
  await AsyncStorage.setItem("accessToken", data.accessToken);
  return data;
}

export async function registerApi(fullName, email, password) {
  return httpPost("/auth/register", { fullName, email, password }, { auth: false });
}
