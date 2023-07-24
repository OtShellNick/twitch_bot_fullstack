import './Layout.scss';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { TLayoutProps } from './Layout.types';

import { getSelf } from '@actions/personal';

import { Header } from '@components/Header';
import { Aside } from '@components/Aside';

const checkCookies = () => {
    const wbautht = cookies().get('wbautht');

    if (!wbautht) redirect('/login');
}

export const Layout = async ({ children }: TLayoutProps) => {
    checkCookies();
    const user = await getSelf();

    console.log('user', user)

    return <div className='wrapper'>
        <Header />
        <div className='wrapper__main'>
            <Aside />
            {children}
        </div>
    </div>
};