import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  id: null,
  email: null,
  key: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserDetails: (
      state: typeof initialState,
      action: PayloadAction<typeof initialState>,
    ) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.key = action.payload.key;
    },
  },
});

export const { setUserDetails } = userSlice.actions;

export const { reducer: userReducer } = userSlice;
