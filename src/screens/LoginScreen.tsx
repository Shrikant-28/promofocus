import { View, Text, Pressable, Image, ActivityIndicator } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useAppDispatch } from "@hooks/useAppDispatch";
import { useAppSelector } from "@hooks/useAppSelector";
import { RootState } from "@store";
import { setGuestMode } from "@slices/authSlice";
import { colors, spacing } from "@utils/theme";
import { useGoogleAuth } from "@services/googleAuth";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state: RootState) => state.auth);
  const { promptAsync } = useGoogleAuth();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center", padding: spacing.lg }}>
      <Image
        source={{ uri: "https://raw.githubusercontent.com/github/explore/main/topics/pomodoro/pomodoro.png" }}
        style={{ width: 120, height: 120, marginBottom: spacing.lg }}
      />
      <Text style={{ color: colors.text, fontSize: 32, fontWeight: "800", textAlign: "center" }}>Pomofocus for Developers</Text>
      <Text style={{ color: colors.secondary, marginTop: spacing.sm, textAlign: "center", lineHeight: 22 }}>
        Organize work sessions, sync across devices, and keep your focus streak running.
      </Text>
      <Pressable
        onPress={() => promptAsync()}
        style={{
          marginTop: spacing.xl,
          width: "100%",
          backgroundColor: colors.primary,
          paddingVertical: spacing.md,
          borderRadius: 14,
          alignItems: "center"
        }}
      >
        {loading ? <ActivityIndicator color="#000" /> : <Text style={{ color: "#000", fontWeight: "700" }}>Continue with Google</Text>}
      </Pressable>
      <Pressable
        onPress={() => dispatch(setGuestMode())}
        style={{
          marginTop: spacing.md,
          width: "100%",
          backgroundColor: colors.surface,
          borderColor: colors.primary,
          borderWidth: 2,
          paddingVertical: spacing.md,
          borderRadius: 14,
          alignItems: "center"
        }}
      >
        <Text style={{ color: colors.primary, fontWeight: "700" }}>Use as Guest</Text>
      </Pressable>
      {error ? <Text style={{ color: colors.danger, marginTop: spacing.sm }}>{error}</Text> : null}
    </View>
  );
}
