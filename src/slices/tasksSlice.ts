import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Task } from "@utils/types";
import { addTask, updateTask, deleteTask, subscribeTasks } from "@services/firestore";

export type TasksState = {
  items: Task[];
  loading: boolean;
  error: string | null;
};

const initialState: TasksState = {
  items: [],
  loading: false,
  error: null
};

export const startTaskListener = createAsyncThunk<void, string>("tasks/startTaskListener", async (userId, { dispatch }) => {
  subscribeTasks(userId, tasks => {
    dispatch(taskListenerUpdated(tasks));
  });
});

export const createTask = createAsyncThunk<void, Omit<Task, "id">>("tasks/createTask", async task => {
  await addTask(task);
});

export const modifyTask = createAsyncThunk<void, { taskId: string; data: Partial<Task> }>("tasks/modifyTask", async ({ taskId, data }) => {
  await updateTask(taskId, data);
});

export const removeTask = createAsyncThunk<void, string>("tasks/removeTask", async taskId => {
  await deleteTask(taskId);
});

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    taskListenerUpdated(state, action: PayloadAction<Task[]>) {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(startTaskListener.pending, state => {
        state.loading = true;
      })
      .addCase(startTaskListener.rejected, (state, action) => {
        state.error = action.error.message ?? "Failed to load tasks.";
        state.loading = false;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.error.message ?? "Unable to create task.";
      })
      .addCase(modifyTask.rejected, (state, action) => {
        state.error = action.error.message ?? "Unable to update task.";
      })
      .addCase(removeTask.rejected, (state, action) => {
        state.error = action.error.message ?? "Unable to delete task.";
      });
  }
});

export const { taskListenerUpdated } = tasksSlice.actions;
export default tasksSlice.reducer;
