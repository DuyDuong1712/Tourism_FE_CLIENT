import {
  createSlice
} from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginReducer: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logoutReducer: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const {
  loginReducer,
  logoutReducer
} = authSlice.actions;
export default authSlice.reducer;