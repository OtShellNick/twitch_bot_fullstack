import { Api } from "./api";

export type TTimer = {
    _id: string;
    announce: number;
    chat_lines: number;
    interval: number;
    message: string;
    name: string;
    timer_status: number;
    user_id: string;
}

const timersApi = Api.injectEndpoints({
    endpoints: build => ({
        getTimersList: build.query<TTimer[], null>({
            query: () => ({
                url: '/timers/list'

            }),
            transformResponse: ({ data }) => data
        }),
        addTimer: build.mutation<Omit<TTimer, '_id'>, Partial<TTimer>>({
            query: data => ({
                url: '/timers/add',
                method: 'POST',
                body: data
            })
        }),
        deleteTimer: build.mutation<null, { timer_id: string }>({
            query: (data) => ({
                url: '/timers/delete',
                method: 'DELETE',
                body: data
            })
        }),
        updateTimer: build.mutation<null, Partial<TTimer>>({
            query: (data) => ({
                url: '/timers/update',
                method: 'PUT',
                body: data
            })
        })
    }),
    overrideExisting: false
});

export const {
    useGetTimersListQuery,
    useAddTimerMutation,
    useDeleteTimerMutation,
    useUpdateTimerMutation,
} = timersApi;