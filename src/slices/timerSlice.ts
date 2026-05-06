import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TimerMode } from "@utils/types";

export type TimerState = {
  mode: TimerMode;
  duration: number;
  startTime: number | null;
  remaining: number;
  isRunning: boolean;
  selectedTaskId?: string;
};

const durations: Record<TimerMode, number> = {
  focus: 25 * 60,
  short_break: 5 * 60,
  long_break: 15 * 60
};

const initialState: TimerState = {
  mode: "focus",
  duration: durations.focus,
  startTime: null,
  remaining: durations.focus,
  isRunning: false,
  selectedTaskId: undefined
};

const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    setMode(state, action: PayloadAction<TimerMode>) {
      state.mode = action.payload;
      state.duration = durations[action.payload];
      state.remaining = durations[action.payload];
      state.isRunning = false;
      state.startTime = null;
    },
    startTimer(state) {
      state.isRunning = true;
      state.startTime = Date.now();
      state.remaining = state.duration;
    },
    pauseTimer(state) {
      state.isRunning = false;
      if (state.startTime) {
        const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
        state.remaining = Math.max(0, state.duration - elapsed);
      }
      state.startTime = null;
    },
    resetTimer(state) {
      state.remaining = state.duration;
      state.startTime = null;
      state.isRunning = false;
    },
    tick(state) {
      if (!state.isRunning || state.startTime === null) {
        return;
      }
      const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
      state.remaining = Math.max(0, state.duration - elapsed);
      if (state.remaining === 0) {
        state.isRunning = false;
        state.startTime = null;
      }
    },
    setSelectedTask(state, action: PayloadAction<string | undefined>) {
      state.selectedTaskId = action.payload;
    },
    hydrateTimer(state, action: PayloadAction<Partial<TimerState>>) {
      const data = action.payload;
      if (data.mode) {
        state.mode = data.mode;
      }
      if (data.duration) {
        state.duration = data.duration;
      }
      if (data.remaining !== undefined) {
        state.remaining = data.remaining;
      }
      if (data.startTime !== undefined) {
        state.startTime = data.startTime;
      }
      if (data.isRunning !== undefined) {
        state.isRunning = data.isRunning;
      }
      if (data.selectedTaskId !== undefined) {
        state.selectedTaskId = data.selectedTaskId;
      }
    }
  }
});

export const { setMode, startTimer, pauseTimer, resetTimer, tick, setSelectedTask, hydrateTimer } = timerSlice.actions;
export const timerDurations = durations;
export default timerSlice.reducer;
