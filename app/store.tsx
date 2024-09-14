// app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './featureSlice/authReducer'; // Import your auth slice

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add other reducers here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
