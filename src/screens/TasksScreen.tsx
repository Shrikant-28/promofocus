import { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Alert } from "react-native";
import { useAppDispatch } from "@hooks/useAppDispatch";
import { useAppSelector } from "@hooks/useAppSelector";
import { createTask, modifyTask, removeTask, startTaskListener } from "@slices/tasksSlice";
import { RootState } from "@store";
import TaskCard from "@components/TaskCard";
import { colors, spacing } from "@utils/theme";
import { Task } from "@utils/types";

const defaultTaskState = { title: "", description: "", tags: "" };

export default function TasksScreen() {
  const dispatch = useAppDispatch();
  const { items: tasks, loading } = useAppSelector((state: RootState) => state.tasks);
  const user = useAppSelector((state: RootState) => state.auth.user);
  const [form, setForm] = useState(defaultTaskState);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      dispatch(startTaskListener(user.id));
    }
  }, [dispatch, user]);

  const productivityByTag = useMemo(() => {
    const tagCount: Record<string, number> = {};
    tasks.forEach(task => {
      task.tags.forEach(tag => {
        tagCount[tag] = (tagCount[tag] ?? 0) + 1;
      });
    });
    return Object.entries(tagCount).sort((a, b) => b[1] - a[1]);
  }, [tasks]);

  const handleSave = async () => {
    if (!form.title.trim()) {
      Alert.alert("Task title is required");
      return;
    }
    const tags = form.tags.split(",").map(tag => tag.trim()).filter(Boolean);
    const task: Omit<Task, "id"> = {
      userId: user?.id ?? "",
      title: form.title,
      description: form.description,
      status: "pending",
      tags,
      createdAt: Date.now()
    };
    if (editingId) {
      await dispatch(modifyTask({ taskId: editingId, data: task }));
      setEditingId(null);
    } else {
      await dispatch(createTask(task));
    }
    setForm(defaultTaskState);
  };

  const handleEdit = (task: Task) => {
    setEditingId(task.id);
    setForm({ title: task.title, description: task.description ?? "", tags: task.tags.join(", ") });
  };

  const handleDelete = (taskId: string) => {
    Alert.alert("Delete task", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => dispatch(removeTask(taskId)) }
    ]);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background, padding: spacing.md }}>
      <Text style={{ color: colors.text, fontSize: 24, fontWeight: "800" }}>Tasks</Text>
      <View style={{ marginTop: spacing.md, backgroundColor: colors.surface, borderRadius: 18, padding: spacing.md }}>
        <TextInput
          placeholder="Task title"
          placeholderTextColor={colors.secondary}
          value={form.title}
          onChangeText={value => setForm(prev => ({ ...prev, title: value }))}
          style={{ color: colors.text, fontSize: 16, borderBottomColor: colors.border, borderBottomWidth: 1, marginBottom: spacing.sm, paddingVertical: 8 }}
        />
        <TextInput
          placeholder="Description"
          placeholderTextColor={colors.secondary}
          value={form.description}
          onChangeText={value => setForm(prev => ({ ...prev, description: value }))}
          multiline
          style={{ color: colors.text, fontSize: 16, minHeight: 60, textAlignVertical: "top", marginBottom: spacing.sm }}
        />
        <TextInput
          placeholder="Tags (comma separated)"
          placeholderTextColor={colors.secondary}
          value={form.tags}
          onChangeText={value => setForm(prev => ({ ...prev, tags: value }))}
          style={{ color: colors.text, fontSize: 16, borderBottomColor: colors.border, borderBottomWidth: 1, marginBottom: spacing.sm, paddingVertical: 8 }}
        />
        <Pressable onPress={handleSave} style={{ backgroundColor: colors.primary, borderRadius: 14, padding: spacing.md, alignItems: "center" }}>
          <Text style={{ fontWeight: "700", color: "#000" }}>{editingId ? "Save changes" : "Add task"}</Text>
        </Pressable>
      </View>
      <Text style={{ color: colors.secondary, marginTop: spacing.lg, marginBottom: spacing.sm }}>Productivity by tag</Text>
      <View style={{ backgroundColor: colors.surface, borderRadius: 18, padding: spacing.md, marginBottom: spacing.lg }}>
        {productivityByTag.map(([tag, count]) => (
          <View key={tag} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.sm }}>
            <Text style={{ color: colors.text }}>{tag}</Text>
            <Text style={{ color: colors.secondary }}>{count} task{count === 1 ? "" : "s"}</Text>
          </View>
        ))}
        {productivityByTag.length === 0 ? <Text style={{ color: colors.secondary }}>Add tags to see a distribution.</Text> : null}
      </View>
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} onPress={() => handleEdit(task)} onDelete={() => handleDelete(task.id)} />
      ))}
      {tasks.length === 0 && <Text style={{ color: colors.secondary, marginTop: spacing.lg }}>No tasks yet. Create a task to assign sessions.</Text>}
    </ScrollView>
  );
}
