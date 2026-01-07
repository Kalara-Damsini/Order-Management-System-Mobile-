/* eslint-disable import/no-unresolved */
import AsyncStorage from "@react-native-async-storage/async-storage";

const TEMP_USER_KEY = "TEMP_USER";

// call this ONCE (or when app loads)
export async function seedTempUser() {
  const user = {
    email: "damsi@gmail.com",
    password: "123",
  };

  await AsyncStorage.setItem(TEMP_USER_KEY, JSON.stringify(user));
}

// used during login
export async function getTempUser() {
  const data = await AsyncStorage.getItem(TEMP_USER_KEY);
  return data ? JSON.parse(data) : null;
}
