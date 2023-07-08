import './Layout.scss';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation'

import { TLayoutProps } from './Layout.types';

const checkCookies = () => {
    const wbautht = cookies().get('wbautht');

    if (!wbautht) redirect('/login')
}

export const Layout = ({ children }: TLayoutProps): JSX.Element => {
    checkCookies();

    return <div>{children}</div>
};