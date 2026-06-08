
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: any = {};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<any>) {
      return action.payload;
    },
    setAuthKey(state, action: PayloadAction<{ key: string; value: any }>) {
      const { key, value } = action.payload;
      state[key] = value;
    },

    clearAuth(state) {
      return initialState;
    }
  },
});

export const { setAuth, clearAuth, setAuthKey } = authSlice.actions;
export default authSlice.reducer;
