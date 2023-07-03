import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';

import Modal from '@containers/Modal/Modal';
import Switcher from '@containers/Switcher/Switcher';
import Icon from '@containers/Icons';

import TimerForm from './components/TimerForm';
import TimersTable from './components/TimersTable';

import { getTimersList } from '@actions/timers.actions';

import './Timers.scss';

const Timers = () => {
	const { t } = useTranslation();
	const [timers, setTimers] = useState([]);
	const [timer, setTimer] = useState(null);
	const [modalOpened, setModalOpened] = useState(false);
	const [isFetching, setIsFetching] = useState(false);

	const getTimers = async () => {
		setIsFetching(true);
		try {
			const data = await getTimersList();
			console.log(data);
			setTimers(data);
			setIsFetching(false);
		} catch (e) {
			console.log('get timers failed', e);
			setIsFetching(false);
		}
	};

	const closeModal = () => {
		setModalOpened(false);
		setTimer(null);
		getTimers();
	};

	const updateModal = timer => {
		setTimer(timer);
		setModalOpened(true);
	};

	useEffect(() => {
		getTimers();
	}, []);

	return (
		<main className='timers'>
			<Modal
				isOpen={modalOpened}
				title={timer ? t('UPDATE_TIMER') : t('ADD_TIMER')}
				onAfterOpen={() => console.log('opened')}
				onRequestClose={closeModal}>
				<TimerForm
					hideForm={closeModal}
					timer={timer}
				/>
			</Modal>

			<div className='timers__header'>
				<div className='timers__header_left'>
					<h1 className='timers__header_heading'>{t('TIMERS')}</h1>
					<div className='timers__header_switcher'>
						{`${t('ENABLE_MODULE')}:`}
						<Switcher
							// checked={checked}
							sx={{ m: 1 }}
							onChange={e => {
								const { checked } = e.target;
								console.log(checked);
							}}
						/>
					</div>
				</div>
				<div className='timers__header_right'>
					<Button
						variant='outlined'
						color='primary'
						className='timers__header_add-timer'
						startIcon={<Icon name='add' />}
						onClick={() => {
							setModalOpened(true);
						}}>
						{t('ADD_TIMER')}
					</Button>
				</div>
			</div>
			<TimersTable
				timers={timers}
				refreshTimers={getTimers}
				isFetching={isFetching}
				updateModal={updateModal}
			/>
		</main>
	);
};

export default Timers;
