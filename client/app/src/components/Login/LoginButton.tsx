'use client'

import { signIn } from "next-auth/react"

const LoginButton = () => {

    return <button
        onClick={() => signIn('twitch')}
        className='login__by-twitch'>
        Login
    </button>
};

export default LoginButton;