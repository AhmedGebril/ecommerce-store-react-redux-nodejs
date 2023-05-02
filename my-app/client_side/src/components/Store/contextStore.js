import { createSlice } from '@reduxjs/toolkit';

const persistedState = localStorage.getItem('reduxState')
  ? JSON.parse(localStorage.getItem('reduxState'))
  : {};

const initialState = {
  username: persistedState.username || '',
  count: persistedState.count || 0,
};

export const counterSlice = createSlice({
  name: 'Store',
  initialState,
  reducers: {
    setName: (state, action) => {
      state.username = action.payload;
      localStorage.setItem('username', action.payload);
    },
    increment: (state) => {
      state.count++;
      localStorage.setItem('reduxState', JSON.stringify(state));
    },
    decrement: (state) => {
      state.count--;
      localStorage.setItem('reduxState', JSON.stringify(state));
    },
    refreshCount: (state) => {
      state.count = 0;
      localStorage.setItem('reduxState', JSON.stringify(state));
    },
  },
});

export const { setName, increment, decrement, refreshCount } = counterSlice.actions;

export default counterSlice.reducer;