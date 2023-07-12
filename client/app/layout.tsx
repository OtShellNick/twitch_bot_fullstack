import { Metadata } from 'next';
import localFont from 'next/font/local';

import Providers from '@store/Providers';

import 'normalize.css';
import '@styles/main.scss';

export const metadata: Metadata = {
    title: 'Twitch Chat Bot',
    icons: {
        icon: '/icons/favicon.png',
    },
};

const fonts = localFont({
    src: [
        {
            path: './../public/webfonts/JetBrainsMono-Thin.woff2',
            weight: '100',
            style: 'normal',
        },
        {
            path: './../public/webfonts/JetBrainsMono-ExtraLight.woff2',
            weight: '200',
            style: 'normal',
        },
        {
            path: './../public/webfonts/JetBrainsMono-Light.woff2',
            weight: '300',
            style: 'normal',
        },
        {
            path: './../public/webfonts/JetBrainsMono-Regular.woff2',
            weight: '400',
            style: 'normal',
        },
        {
            path: './../public/webfonts/JetBrainsMono-Medium.woff2',
            weight: '500',
            style: 'normal',
        },
        {
            path: './../public/webfonts/JetBrainsMono-SemiBold.woff2',
            weight: '600',
            style: 'normal',
        },
        {
            path: './../public/webfonts/JetBrainsMono-Bold.woff2',
            weight: '700',
            style: 'normal',
        },
        {
            path: './../public/webfonts/JetBrainsMono-ExtraBold.woff2',
            weight: '800',
            style: 'normal',
        },
    ],
});

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
    return <html lang="en" className={fonts.className}>
        <body>
            <Providers>
                {children}
            </Providers>
        </body>
    </html>
};

export default RootLayout;