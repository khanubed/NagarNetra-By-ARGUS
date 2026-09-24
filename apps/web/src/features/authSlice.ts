import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type Role = 'Super Admin' | 'Traffic Police' | 'Municipal Officer' | 'Citizen' | 'Public';

interface AuthState {
  role: Role;
}

const initialState: AuthState = {
  role: 'Traffic Police',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<Role>) => {
      state.role = action.payload;
    },
  },
});

export const { setRole } = authSlice.actions;
export default authSlice.reducer;
