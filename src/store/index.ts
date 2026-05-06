import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@slices/authSlice";
import timerReducer from "@slices/timerSlice";
import tasksReducer from "@slices/tasksSlice";
import sessionsReducer from "@slices/sessionsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    timer: timerReducer,
    tasks: tasksReducer,
    sessions: sessionsReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
