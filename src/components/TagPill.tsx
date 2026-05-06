import { View, Text } from "react-native";
import { colors, spacing } from "@utils/theme";

type TagPillProps = {
  title: string;
};

export default function TagPill({ title }: TagPillProps) {
  return (
    <View style={{ backgroundColor: "rgba(56, 189, 248, 0.18)", paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999, marginRight: 8, marginBottom: 8 }}>
      <Text style={{ color: colors.primary, fontSize: 12, fontWeight: "700" }}>{title}</Text>
    </View>
  );
}
