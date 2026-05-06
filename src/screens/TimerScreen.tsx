import { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useAppDispatch } from "@hooks/useAppDispatch";
import { useAppSelector } from "@hooks/useAppSelector";
import { RootState } from "@store";
import { pauseTimer, resetTimer, setMode, startTimer, tick, setSelectedTask } from "@slices/timerSlice";
import { logSession, startSessionListener } from "@slices/sessionsSlice";
import TimerCircle from "@components/TimerCircle";
import { colors, spacing } from "@utils/theme";
import { buildSessionLabel } from "@utils/format";
import { scheduleTimerCompleteNotification } from "@services/notification";

const MODES = ["focus", "short_break", "long_break"] as const;

export default function TimerScreen() {
  const dispatch = useAppDispatch();
  const timer = useAppSelector((state: RootState) => state.timer);
  const tasks = useAppSelector((state: RootState) => state.tasks.items);
  const user = useAppSelector((state: RootState) => state.auth.user);
  const [tickLock, setTickLock] = useState(false);

  useEffect(() => {
    if (timer.isRunning) {
      const interval = setInterval(() => {
        dispatch(tick());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [dispatch, timer.isRunning]);

  useEffect(() => {
    if (timer.remaining === 0 && timer.startTime === null && !timer.isRunning) {
      scheduleTimerCompleteNotification().catch(() => null);
      const sessionType = timer.mode;
      if (user) {
        dispatch(logSession({
          userId: user.id,
          taskId: timer.selectedTaskId,
          type: sessionType,
          duration: timer.duration,
          startTime: Date.now() - timer.duration * 1000,
          endTime: Date.now(),
          completed: true
        }));
      }
    }
  }, [dispatch, timer.remaining, timer.mode, timer.startTime, timer.duration, timer.selectedTaskId, user]);

  useEffect(() => {
    if (user) {
      dispatch(startSessionListener(user.id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (timer.isRunning && !tickLock) {
      setTickLock(true);
      setTimeout(() => setTickLock(false), 1000);
    }
  }, [timer.isRunning, tickLock]);

  const selectedTask = useMemo(() => tasks.find(task => task.id === timer.selectedTaskId), [tasks, timer.selectedTaskId]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: spacing.md }}>
      <Text style={{ color: colors.text, fontSize: 24, fontWeight: "800", marginTop: spacing.md }}>Timer</Text>
      <TimerCircle seconds={timer.remaining} mode={timer.mode} />
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: spacing.md }}> 
        {MODES.map(mode => (
          <Pressable
            key={mode}
            onPress={() => dispatch(setMode(mode))}
            style={{
              flex: 1,
              marginHorizontal: 4,
              paddingVertical: spacing.sm,
              borderRadius: 12,
              backgroundColor: timer.mode === mode ? colors.primary : colors.surface,
              alignItems: "center"
            }}
          >
            <Text style={{ color: colors.text, textTransform: "capitalize", fontWeight: "700" }}>{buildSessionLabel(mode)}</Text>
          </Pressable>
        ))}
      </View>
      <View style={{ marginTop: spacing.lg, backgroundColor: colors.surface, borderRadius: 18, padding: spacing.md }}>
        <Text style={{ color: colors.secondary, marginBottom: spacing.sm }}>Assigned task</Text>
        <Pressable onPress={() => {}} style={{ minHeight: 60, justifyContent: "center" }}>
          <Text style={{ color: colors.text, fontSize: 16 }}>
            {selectedTask ? selectedTask.title : "Select a task from Tasks tab"}
          </Text>
        </Pressable>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: spacing.lg }}>
        <Pressable
          onPress={() => dispatch(timer.isRunning ? pauseTimer() : startTimer())}
          style={{ flex: 1, marginRight: 8, backgroundColor: colors.primary, borderRadius: 14, padding: spacing.md, alignItems: "center" }}
        >
          <Text style={{ fontWeight: "700" }}>{timer.isRunning ? "Pause" : "Start"}</Text>
        </Pressable>
        <Pressable
          onPress={() => dispatch(resetTimer())}
          style={{ flex: 1, marginLeft: 8, backgroundColor: colors.surface, borderRadius: 14, padding: spacing.md, alignItems: "center" }}
        >
          <Text style={{ color: colors.text, fontWeight: "700" }}>Reset</Text>
        </Pressable>
      </View>
      <View style={{ marginTop: spacing.lg, backgroundColor: colors.surface, borderRadius: 18, padding: spacing.md }}>
        <Text style={{ color: colors.secondary, marginBottom: spacing.sm }}>Recent sessions</Text>
        {useAppSelector((state: RootState) => state.sessions.items.slice(0, 3)).map(session => (
          <View key={session.id} style={{ marginBottom: spacing.sm }}>
            <Text style={{ color: colors.text }}>{buildSessionLabel(session.type)}</Text>
            <Text style={{ color: colors.secondary, fontSize: 12 }}>{new Date(session.endTime).toLocaleString()}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
