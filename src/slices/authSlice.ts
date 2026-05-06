import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { UserProfile } from "@utils/types";
import { getFirebaseAuth } from "@services/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { createOrUpdateUser } from "@services/firestore";

export type AuthState = {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null
};

export const signOutUser = createAsyncThunk("auth/signOut", async () => {
  const auth = getFirebaseAuth();
  await signOut(auth);
});

export const initAuthListener = createAsyncThunk<UserProfile | null>("auth/initAuthListener", async () => {
  const auth = getFirebaseAuth();
  return new Promise<UserProfile | null>(resolve => {
    onAuthStateChanged(auth, async user => {
      if (user) {
        const profile: UserProfile = {
          id: user.uid,
          name: user.displayName ?? "Developer",
          email: user.email ?? "",
          photoURL: user.photoURL ?? "",
          createdAt: Date.now()
        };
        await createOrUpdateUser(profile);
        resolve(profile);
      } else {
        resolve(null);
      }
    });
  });
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserProfile | null>) {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    setGuestMode(state) {
      state.user = {
        id: "guest_" + Date.now(),
        name: "Guest Developer",
        email: "",
        photoURL: "",
        createdAt: Date.now()
      };
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(signOutUser.fulfilled, state => {
        state.user = null;
      })
      .addCase(initAuthListener.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  }
});

export const { setUser, setGuestMode } = authSlice.actions;
export default authSlice.reducer;
