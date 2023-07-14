import { Api } from "./api";

type TTimer = {

}

const timersApi = Api.injectEndpoints({
    endpoints: build => ({
        getTimersList: build.query<TTimer, null>({
            query: () => ({
                url: '/timers/list'

            }),
            transformResponse: ({ data }) => data
        })
    }),
    overrideExisting: false
});

export const { useGetTimersListQuery } = timersApi;