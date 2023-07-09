'use client';

import { useEffect } from "react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { deleteCookie } from 'cookies-next';

import { useGetSelfQuery } from "@store/api";

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