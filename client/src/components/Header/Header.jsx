import React, { memo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { changeLanguage } from 'i18next';
import Icon from '@containers/Icons';

import Dropdown from '@/containers/Dropdown';
import Profile from './elements/Profile/Profile';

import './Header.scss';

const Header = () => {
  const { user } = useSelector(state => state);
  const [language, setLanguage] = useState(localStorage.getItem('i18nextLng') || 'ru-RU');
  console.log(user);
  const options = [
    {
      value: 'ru-RU',
      label: (
        <div
          key='1'
          className='header__dropdown_menu_item'
          onClick={() => {
            localStorage.setItem('i18nextLng', 'ru-RU');
            setLanguage('ru-RU');
            changeLanguage('ru-RU');
          }}>
          <Icon name='ru' className='icon_md' />
        </div>
      ),
    },
    {
      value: 'en-EN',
      label: (
        <div
          key='2'
          className='header__dropdown_menu_item'
          onClick={() => {
            localStorage.setItem('i18nextLng', 'en-EN');
            setLanguage('en-EN');
            changeLanguage('en-EN');
          }}>
          <Icon name='en' className='icon_md' />
        </div>
      ),
      className: 'myOptionClassName',
    },
  ];

  return (
    <header className='header'>
      <h1 className='header__heading'>WitchBot</h1>
      <div className='header__right'>
        <div className='header__profile-info'>
          <Dropdown
            content={options.map(option => option.label)}
            trigger={options.find(option => option.value === language).label}
          />
          {user && (
            <Dropdown
              content={<Profile />}
              trigger={
                <>
                  <img
                    src={user.profile_image_url}
                    className='header__profile-info_avatar'
                    alt='user photo'
                  />
                  <span>{user.display_name}</span>
                </>
              }
              position='bottom_right'
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
