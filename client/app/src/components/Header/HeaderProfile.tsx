'use client';

import { useGetSelfQuery } from "@store/api";
import { redirect } from "next/navigation";
import Image from "next/image";
import { useEffect } from "react";
import { deleteCookie } from 'cookies-next';

const HeaderProfile = () => {
    const { isFetching, data: user, error, isError } = useGetSelfQuery(null);

    useEffect(() => {
        if (isError && 'status' in error) {
            const { status } = error;
            if (status === (404 || 401)) {
                console.log('@@error')
                deleteCookie('wbautht');
                redirect('login');
            }
        }
    }, [isError]);

    console.log('@@user', user);

    if (!isFetching) return <>
        <Image
            src={user.profile_image_url}
            alt='avatar'
            width={35}
            height={35}
            priority
            className="header__profile-info_avatar"
        />
        <span>{user.display_name}</span>
    </>
};

export default HeaderProfile;