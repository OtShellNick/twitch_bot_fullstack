'use client';

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import { login } from "@actions/personal";

const CheckAuthCode = () => {
    const searchParams = useSearchParams();

    const code = searchParams.get('code');

    const loginAction = async (code) => {
        try {
            const data = await login(code);

            console.log('login data', data.json());
        } catch (err) {
            console.log('login error', err);
        }
    };

    useEffect(() => {
        if (code) loginAction(code);
    }, [code]);

    return <></>;
};

export default CheckAuthCode;