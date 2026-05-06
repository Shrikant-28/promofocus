import { View, Text, Pressable, ScrollView } from "react-native";
import { useAppDispatch } from "@hooks/useAppDispatch";
import { signOutUser } from "@slices/authSlice";
import { colors, spacing } from "@utils/theme";

export default function SettingsScreen() {
  const dispatch = useAppDispatch();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background, padding: spacing.md }}>
      <Text style={{ color: colors.text, fontSize: 24, fontWeight: "800" }}>Settings</Text>
      <View style={{ marginTop: spacing.md, backgroundColor: colors.surface, borderRadius: 18, padding: spacing.md }}>
        <Text style={{ color: colors.secondary, marginBottom: spacing.sm }}>Timer preferences</Text>
        <Text style={{ color: colors.text, marginBottom: spacing.sm }}>Customize durations and developer productivity options in future releases.</Text>
      </View>
      <Pressable
        onPress={() => dispatch(signOutUser())}
        style={{ marginTop: spacing.lg, backgroundColor: colors.danger, borderRadius: 14, padding: spacing.md, alignItems: "center" }}
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>Sign out</Text>
      </Pressable>
    </ScrollView>
  );
}
