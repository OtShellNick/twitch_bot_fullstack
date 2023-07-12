'use client';

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { deleteCookie } from 'cookies-next';
import { User, Dropdown, Text } from "@nextui-org/react";
import { signOut } from "next-auth/react";
import Image from "next/image";

import { useGetSelfQuery } from "@store/api";

const HeaderProfile = () => {
    const { isFetching, data: user, error, isError } = useGetSelfQuery(null);
    const url = process.env.NEXT_PUBLIC_REDIRECT_URI;

    useEffect(() => {
        if (isError && 'status' in error) {
            const { status } = error;
            if (status === 401 || status === 401) {
                deleteCookie('wbautht');
                redirect('login');
            }
        }
    }, [isError]);

    if (!isFetching && !isError && user) return <>
        <Dropdown placement="bottom-left" disableAnimation>
            <Dropdown.Trigger>
                <User
                    src={user.profile_image_url}
                    name={user.display_name}
                    color="secondary"
                    pointer
                    style={{ marginRight: 0 }}
                />
            </Dropdown.Trigger>
            <Dropdown.Menu color="secondary">
                <Dropdown.Item icon={<Image className="header__profile-info_icon" src='/icons/logout.svg' alt="logout" width={18} height={18} color='inherit' />} key="logout" color="error" withDivider css={{ height: "$14" }}>
                    <Text color="inherit" css={{ d: "flex" }} onClick={() => {
                        signOut({ callbackUrl: `${url}login` });
                        deleteCookie('wbautht');
                    }}>
                        Logout
                    </Text>
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    </>
};

export default HeaderProfile;