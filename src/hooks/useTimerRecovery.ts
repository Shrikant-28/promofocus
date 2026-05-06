import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppDispatch } from "@hooks/useAppDispatch";
import { useAppSelector } from "@hooks/useAppSelector";
import { hydrateTimer } from "@slices/timerSlice";

const STORAGE_KEY = "pomofocus_timer_state";

export default function useTimerRecovery() {
  const dispatch = useAppDispatch();
  const timer = useAppSelector(state => state.timer);

  useEffect(() => {
    async function restoreTimer() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (!stored) return;
        const parsed = JSON.parse(stored) as Partial<typeof timer>;
        if (parsed) {
          dispatch(hydrateTimer(parsed));
        }
      } catch (error) {
        console.warn("Unable to restore timer state", error);
      }
    }
    restoreTimer();
  }, [dispatch]);

  useEffect(() => {
    async function saveTimer() {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(timer));
      } catch (error) {
        console.warn("Unable to persist timer state", error);
      }
    }
    saveTimer();
  }, [timer]);
}
