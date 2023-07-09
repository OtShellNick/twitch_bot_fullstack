import './Layout.scss';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { TLayoutProps } from './Layout.types';

import { Header } from '@components/Header';

const checkCookies = () => {
    const wbautht = cookies().get('wbautht');

    if (!wbautht) redirect('/login');
}

export const Layout = ({ children }: TLayoutProps): JSX.Element => {
    checkCookies();

    return <div className='wrapper'>
        <Header />
        <div className='wrapper__main'>
            {/* <Aside /> */}
            {children}
        </div>
    </div>
};