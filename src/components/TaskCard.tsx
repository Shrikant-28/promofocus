import { View, Text, Pressable } from "react-native";
import { Task } from "@utils/types";
import { colors, spacing } from "@utils/theme";
import TagPill from "./TagPill";

type TaskCardProps = {
  task: Task;
  onPress: () => void;
  onDelete: () => void;
};

export default function TaskCard({ task, onPress, onDelete }: TaskCardProps) {
  return (
    <Pressable onPress={onPress} style={{ marginBottom: spacing.md, borderRadius: 16, backgroundColor: colors.surface, padding: spacing.md }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: "700" }}>{task.title}</Text>
        <Pressable onPress={onDelete} style={{ padding: 8 }}>
          <Text style={{ color: colors.danger }}>Delete</Text>
        </Pressable>
      </View>
      {task.description ? <Text style={{ color: colors.secondary, marginTop: 8 }}>{task.description}</Text> : null}
      <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
        {task.tags.map(tag => (
          <TagPill key={`${task.id}-${tag}`} title={tag} />
        ))}
      </View>
    </Pressable>
  );
}
