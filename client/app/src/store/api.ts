import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

//TODO: update user type
type User = {
    id: number;
    name: string;
    email: number;
};

export const Api = createApi({
    reducerPath: "Api",
    refetchOnFocus: true,
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8082/v1/",
        credentials: 'include',
    }),
    endpoints: (builder) => ({
        getSelf: builder.query<User, null>({
            query: () => `user/self`,
        }),
    }),
});

export const { useGetSelfQuery } = Api;