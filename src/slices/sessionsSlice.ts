import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { PomodoroSession } from "@utils/types";
import { createSession, subscribeSessions } from "@services/firestore";

export type SessionsState = {
  items: PomodoroSession[];
  loading: boolean;
  error: string | null;
};

const initialState: SessionsState = {
  items: [],
  loading: false,
  error: null
};

export const startSessionListener = createAsyncThunk<void, string>("sessions/startSessionListener", async (userId, { dispatch }) => {
  // Skip Firestore sync for guest users
  if (userId.startsWith("guest_")) {
    dispatch(sessionListenerUpdated([]));
    return;
  }
  subscribeSessions(userId, sessions => {
    dispatch(sessionListenerUpdated(sessions));
  });
});

export const logSession = createAsyncThunk<void, Omit<PomodoroSession, "id">>("sessions/logSession", async session => {
  // Skip Firestore save for guest users
  if (session.userId.startsWith("guest_")) {
    return;
  }
  await createSession(session);
});

const sessionsSlice = createSlice({
  name: "sessions",
  initialState,
  reducers: {
    sessionListenerUpdated(state, action: PayloadAction<PomodoroSession[]>) {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(startSessionListener.pending, state => {
        state.loading = true;
      })
      .addCase(startSessionListener.rejected, (state, action) => {
        state.error = action.error.message ?? "Failed to load sessions.";
        state.loading = false;
      })
      .addCase(logSession.rejected, (state, action) => {
        state.error = action.error.message ?? "Unable to log session.";
      });
  }
});

export const { sessionListenerUpdated } = sessionsSlice.actions;
export default sessionsSlice.reducer;
