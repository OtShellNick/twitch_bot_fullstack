import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Switcher from '@containers/Switcher/Switcher';

import { switchOnBot, switchOffBot } from '@actions/bot.actions';
import { getSelf } from '@actions/personal';
import { getUserInfo } from '@store/user.store';

import './Dashboard.scss';

const Dashboard = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const {
		user: { bot_status },
	} = useSelector(state => state);
	const switchBot = async () => {
		const action = !!bot_status ? switchOffBot : switchOnBot;

		try {
			await action();
			const { data } = await getSelf();
			dispatch(getUserInfo(data));
		} catch (err) {
			console.log('error switch bot', err);
		}
	};

	return (
		<main className='dashboard'>
			<h1>{t('DASHBOARD')}</h1>
			<div>
				{`${t('ENABLE_BOT')}:`}
				<Switcher
					checked={!!bot_status}
					sx={{ m: 1 }}
					onChange={switchBot}
				/>
			</div>
		</main>
	);
};

export default Dashboard;
