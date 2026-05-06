import { View, Text } from "react-native";
import { colors, spacing } from "@utils/theme";
import { formatSeconds } from "@utils/format";

type TimerCircleProps = {
  seconds: number;
  mode: string;
};

export default function TimerCircle({ seconds, mode }: TimerCircleProps) {
  return (
    <View style={{ alignItems: "center", justifyContent: "center", padding: spacing.lg }}>
      <View
        style={{
          width: 260,
          height: 260,
          borderRadius: 260,
          borderWidth: 16,
          borderColor: colors.border,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(56, 189, 248, 0.08)"
        }}
      >
        <Text style={{ color: colors.secondary, fontSize: 16, textTransform: "uppercase", letterSpacing: 2 }}>{mode.replace("_", " ")}</Text>
        <Text style={{ color: colors.text, fontSize: 56, fontWeight: "800", marginTop: 12 }}>{formatSeconds(seconds)}</Text>
      </View>
    </View>
  );
}
