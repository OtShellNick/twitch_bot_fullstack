import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Icon from '@containers/Icons';

import './Menu.scss';

const MENU = [
  {
    name: 'dashboard',
    title: 'DASHBOARD',
  },
  {
    name: 'timers',
    title: 'TIMERS',
  },
];

const Menu = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const nav = useNavigate();

  return (
    <ul className='menu'>
      {MENU.map((menu, index) => {
        return (
          <li
            key={menu.name + index}
            className={classNames({
              menu__item: true,
              menu__item_active: location.pathname === `/${menu.name}`,
            })}
            onClick={() => {
              nav(`/${menu.name}`);
            }}>
            <Icon className='menu__item_icon icon_sm' name={menu.name} />
            {t(menu.title)}
          </li>
        );
      })}
    </ul>
  );
};

export default Menu;
