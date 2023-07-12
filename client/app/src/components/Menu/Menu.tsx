import './Menu.scss';

import { headers } from 'next/headers';
import Link from 'next/link'
import cn from 'classnames';

import IconDashboard from '/public/icons/dashboard.svg?tsx';
import IconTimers from '/public/icons/timers.svg?tsx';

export const Menu = () => {
    const headersList = headers();
    const pathname = headersList.get('x-url').split('/').at(-1) || "";

    const MENU = [
        {
            name: 'dashboard',
            title: 'DASHBOARD',
            icon: <IconDashboard className='menu__item_icon icon_sm' />
        },
        {
            name: 'timers',
            title: 'TIMERS',
            icon: <IconTimers className='menu__item_icon icon_sm' />
        },
    ];

    return <ul className='menu'>
        {MENU.map((menu, index) => {
            return (
                <li
                    key={menu.name + index}>
                    <Link className={cn({
                        'menu__item': true,
                        'menu__item_active': pathname === menu.name,
                    })} href={`/${menu.name}`} >
                        {menu.icon}
                        {menu.title}
                    </Link>
                </li>
            );
        })}
    </ul>
}