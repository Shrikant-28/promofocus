import { useMemo } from "react";
import { View, Text, ScrollView } from "react-native";
import { useAppSelector } from "@hooks/useAppSelector";
import { colors, spacing } from "@utils/theme";

export default function StatsScreen() {
  const sessions = useAppSelector(state => state.sessions.items);

  const totals = useMemo(() => {
    const current = new Date();
    const today = current.toISOString().slice(0, 10);
    const weekStart = new Date(current);
    weekStart.setDate(current.getDate() - current.getDay());

    let dailyFocus = 0;
    let weeklyFocus = 0;
    let completedCount = 0;
    const tagMap: Record<string, number> = {};

    sessions.forEach(session => {
      const sessionDate = new Date(session.endTime);
      const sessionDay = sessionDate.toISOString().slice(0, 10);
      const isToday = sessionDay === today;
      const isThisWeek = sessionDate >= weekStart;

      if (session.type === "focus") {
        completedCount += 1;
        dailyFocus += isToday ? session.duration : 0;
        weeklyFocus += isThisWeek ? session.duration : 0;
      }

      if (session.taskId) {
        tagMap[session.taskId] = (tagMap[session.taskId] ?? 0) + 1;
      }
    });

    return { dailyFocus, weeklyFocus, completedCount, tagMap };
  }, [sessions]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background, padding: spacing.md }}>
      <Text style={{ color: colors.text, fontSize: 24, fontWeight: "800" }}>Stats</Text>
      <View style={{ marginTop: spacing.md, backgroundColor: colors.surface, borderRadius: 18, padding: spacing.md }}>
        <Text style={{ color: colors.secondary, marginBottom: 12 }}>Focus time</Text>
        <Text style={{ color: colors.text, fontSize: 18 }}>Today: {Math.floor(totals.dailyFocus / 60)} min</Text>
        <Text style={{ color: colors.text, fontSize: 18, marginTop: spacing.sm }}>This week: {Math.floor(totals.weeklyFocus / 60)} min</Text>
        <Text style={{ color: colors.text, fontSize: 18, marginTop: spacing.sm }}>Completed sessions: {totals.completedCount}</Text>
      </View>
      <View style={{ marginTop: spacing.lg, backgroundColor: colors.surface, borderRadius: 18, padding: spacing.md }}>
        <Text style={{ color: colors.secondary, marginBottom: 12 }}>Focus streak</Text>
        <Text style={{ color: colors.text, fontSize: 18 }}>You have completed {totals.completedCount} focus units.</Text>
      </View>
    </ScrollView>
  );
}
