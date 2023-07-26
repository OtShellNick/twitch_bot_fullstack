import React, { memo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { changeLanguage } from 'i18next';
import Dropdown from 'sbx-react-dropdown';
import Icon from '@containers/Icons';

import Profile from './elements/Profile/Profile';

import './Header.scss';

const Header = () => {
  const { user } = useSelector(state => state);
  const dropdown = useRef(null);
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
            dropdown.current.hide();
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
            dropdown.current.hide();
          }}>
          <Icon name='en' className='icon_md' />
        </div>
      ),
      className: 'myOptionClassName',
    },
    {
      value: 'ua-UA',
      label: (
        <div
          key='3'
          className='header__dropdown_menu_item'
          onClick={() => {
            localStorage.setItem('i18nextLng', 'ua-UA');
            setLanguage('ua-UA');
            changeLanguage('ua-UA');
            dropdown.current.hide();
          }}>
          <Icon name='ua' className='icon_md' />
        </div>
      ),
    },
  ];

  return (
    <header className='header'>
      <h1 className='header__heading'>WitchBot</h1>
      <div className='header__right'>
        <div className='header__profile-info'>
          <Dropdown ref={dropdown} data={options.map(option => option.label)} position='bottom'>
            {options.find(option => option.value === language).label}
          </Dropdown>
          {user && (
            <Dropdown data={<Profile />} position='bottom_right'>
              <img
                src={user.profile_image_url}
                className='header__profile-info_avatar'
                alt='user photo'
              />
              <span>{user.display_name}</span>
            </Dropdown>
          )}
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
