import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  email: string;
  name: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ token: string; user: User }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      // Optionally store token in localStorage or cookies
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', action.payload.token);
      }
    },
    logout(state) {
      state.token = null;
      state.user = null;
      // Optionally remove token from localStorage or cookies
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
      }
    },
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
  },
});

export const { login, logout, setToken, setUser } = authSlice.actions;

export default authSlice.reducer;
