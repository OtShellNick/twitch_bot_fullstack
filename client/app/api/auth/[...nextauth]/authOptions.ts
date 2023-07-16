import type { NextAuthOptions } from 'next-auth';
import { cookies } from 'next/headers'
import TwitchProvider from "next-auth/providers/twitch";
import { login } from "@actions/personal";

const SCOPES = [
    'openid',
    'user:read:email',
    'channel:manage:moderators',
    'chat:read',
    'chat:edit',
    'channel:moderate'
]

export const authOptions: NextAuthOptions = {
    providers: [
        TwitchProvider({
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.SECRET_KEY,
            authorization: {
                params: {
                    scope: SCOPES.join(' ')
                }
            }
        })
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            try {
                const { token } = await login(account);

                cookies().set({
                    name: 'wbautht',
                    value: token,
                    path: '/'
                });

                return '/dashboard'
            } catch (err) {
                console.log('signin error', err);

                return '/login';
            }
        },
        async redirect({ url, baseUrl }) {
            return baseUrl
        },
        async session({ session, token, user }) {
            return session
        },
        async jwt({ token, user, account, profile, isNewUser }) {
            return token
        }
    }
};