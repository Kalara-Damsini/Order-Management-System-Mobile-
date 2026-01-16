import * as ImagePicker from "expo-image-picker";
import { Alert, Pressable, Text, View } from "react-native";

export default function UploadProofBox({ onPick }) {
  const pick = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission needed", "Please allow photo access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 5,
    });

    if (result.canceled) return;

    const assets = result.assets || [];
    if (!assets.length) return;

    onPick?.(assets);
  };

  return (
    <View style={{ gap: 10 }}>
      <Pressable
        onPress={pick}
        style={{
          backgroundColor: "#F3F4F6",
          padding: 14,
          borderRadius: 14,
          alignItems: "center",
        }}
      >
        <Text style={{ fontWeight: "900" }}>Upload proof images</Text>
        <Text style={{ opacity: 0.7, marginTop: 6 }}>Select up to 5 photos</Text>
      </Pressable>
    </View>
  );
}
