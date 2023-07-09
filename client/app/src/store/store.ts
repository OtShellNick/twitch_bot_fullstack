import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { Api } from "./api";

export const store = configureStore({
    reducer: {
        [Api.reducerPath]: Api.reducer,
    },
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({}).concat([Api.middleware]),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;