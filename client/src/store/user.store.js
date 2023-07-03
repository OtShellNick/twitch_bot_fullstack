import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		loginUser: (state, action) => action.payload,
		logoutUser: state => ({}),
		getUserInfo: (state, action) => action.payload,
	},
});

export const { loginUser, logoutUser, getUserInfo } = userSlice.actions;
export default userSlice.reducer;
