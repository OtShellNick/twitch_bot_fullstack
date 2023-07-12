import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

//TODO: update user type
type User = {
    id?: number;
    login?: string;
    display_name?: string;
    email?: number;
    profile_image_url?: string;
    bot_status?: number;
};

type TResponse<T> = {
    data: T;
    status: number;
}

export const Api = createApi({
    reducerPath: "Api",
    refetchOnFocus: true,
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_SERVER_URI + 'v1/',
        credentials: 'include',
    }),
    endpoints: (builder) => ({
        getSelf: builder.query<User, null>({
            query: () => ({
                url: `user/self`,
            }),
            transformResponse: ({ data }: TResponse<User>) => data,
        }),
        userUpdate: builder.mutation<User, User>({
            query: (userData) => ({
                method: 'POST',
                url: 'user/update',
                body: userData
            })
        })
    }),
});

export const { useGetSelfQuery, useUserUpdateMutation } = Api;