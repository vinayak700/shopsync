import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { firebaseAuth, googleProvider } from "../../config/firebaseInit";
import { toast } from "react-toastify";

const initialState = {
  isAdmin: false,
  loading: false,
  currentUser: null,
};
const auth = getAuth();

// Asynchronous reducer functions
export const signUp = createAsyncThunk(
  "auth/signUp",
  async (payload, thunkAPI) => {
    const { email, password } = payload;
    try {
      return await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
    } catch (error) {
      console.log(error);
    }
  }
);
export const signIn = createAsyncThunk(
  "auth/signIn",
  async (payload, thunkAPI) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        firebaseAuth,
        payload.email,
        payload.password
      );
      return userCredential;
    } catch (error) {
      console.log(error);
      switch (error.code) {
        case "auth/user-not-found":
          toast.error("User not found.");
          break;
        case "auth/invalid-credential":
          toast.error("Invalid email address or password.");
          break;
        case "auth/wrong-password":
          toast.error("Incorrect password.");
          break;
        default:
          toast.error("Error during sign-in.");
      }
    }
  }
);
export const signInWithGoogle = createAsyncThunk(
  "auth/signInWithGoogle",
  async (_, thunkAPI) => {
    try {
      return await signInWithPopup(firebaseAuth, googleProvider);
    } catch (error) {
      console.log(error);
    }
  }
);
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (payload, thunkAPI) => {
    try {
      return await sendPasswordResetEmail(auth, payload.email);
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const setUser = createAsyncThunk("auth/setUser", async (_, thunkAPI) => {
  try {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        return user;
      } else {
        return null;
      }
    });
  } catch (error) {
    console.log(error);
    return null;
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state, action) => {
      signOut(firebaseAuth);
      state.currentUser = null;
    },
    setUser: (state, action) => {
      const user = action.payload;
      if (user && user.email === "vinayakt890@gmail.com") {
        state.isAdmin = true;
      }
      state.currentUser = user;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.fulfilled, () => {})
      .addCase(signIn.fulfilled, (state, action) => {
        if (state.currentUser?.email === "vinayakt890@gmail.com") {
          state.isAdmin = true;
        }
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        // state.currentUser = action.payload.user;
        if (
          state.currentUser &&
          state.currentUser.email === "vinayakt890@gmail.com"
        ) {
          state.isAdmin = true;
        }
      })
      .addCase(resetPassword.fulfilled, () => {
        toast.success("Check you Email inbox for password reset link");
      })
      .addCase(setUser.fulfilled, (state, action) => {
        const user = action.payload;
        if (user && user.email === "vinayakt890@gmail.com") {
          state.isAdmin = true;
        }
        state.currentUser = user;
        console.log(state.currentUser);
      });
  },
});

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;

export const authSelector = (state) => state.authReducer;
