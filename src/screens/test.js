import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function TestConnection() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("http://10.0.2.2:3000/hello") // ✅ correct URL
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setMessage(data.message))
      .catch((err) => {
        console.error("API error:", err);
        setMessage("Failed to load message");
      });
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text>{message}</Text>
    </View>
  );
}
