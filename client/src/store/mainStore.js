import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user.store";

const store = configureStore({
	reducer: {
		user: userReducer,
	},
});

export default store;
