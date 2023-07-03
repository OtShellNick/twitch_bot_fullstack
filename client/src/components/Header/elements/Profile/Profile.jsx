import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Icon from '@containers/Icons';

import { logout, getSelf } from '@actions/personal';
import { loginUser, logoutUser } from '@store/user.store';

import './Profile.scss';

const Profile = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const nav = useNavigate();

	return (
		<div className='profile'>
			<div
				className='profile__item'
				onClick={() => {
					dispatch(logoutUser());
					logout();
					nav('/login');
				}}>
				<span className='profile__item_text'>{t('EXIT')}</span>
				<Icon name='logout' />
			</div>
		</div>
	);
};

export default Profile;
