'use client';

import { useGetSelfQuery } from "@store/api";
import { } from '@store/api'
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { deleteCookie, getCookies } from 'cookies-next';

const HeaderProfile = () => {
    const { isLoading, isFetching, data, error, isError } = useGetSelfQuery(null);

    useEffect(() => {
        if (isError && 'status' in error) {
            const { status } = error;
            if (status === (404 || 401)) {
                console.log('@@error')
                deleteCookie('wbautht');
                redirect('login');
            }
        }
    }, [isError])

    return <div>User</div>
};

export default HeaderProfile;