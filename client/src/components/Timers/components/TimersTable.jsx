import React from 'react';
import { useTranslation } from 'react-i18next';
import className from 'classnames';

import Icon from '@containers/Icons';
import Confirm from '@containers/Confirm/Confirm';
import Switcher from '@containers/Switcher/Switcher';

import { removeTimer, updateTimer } from '@actions/timers.actions';

const TimersTable = ({ timers, refreshTimers, isFetching, updateModal }) => {
	const { t } = useTranslation();

	const deleteTimer = async id => {
		try {
			await removeTimer(id);
			await refreshTimers();
		} catch (err) {
			console.log('error removing timer', err);
		}
	};
	if (isFetching) return null;
	return (
		<div className='timers__table'>
			<div className='timers__table_row timers__table_header'>
				<div>{t('TIMERS_TABLE_NAME')}</div>
				<div>{t('TIMERS_TABLE_MESSAGE')}</div>
				<div>{t('TIMERS_TABLE_INTERVAL')}</div>
				<div>{t('TIMERS_TABLE_CHAT_LINES')}</div>
				<div>{t('TIMERS_TABLE_ACTIONS')}</div>
			</div>
			{timers
				.filter(t => !!t.timer_status)
				.map((timer, index) => {
					return (
						<div
							className={className({
								'timers__table_row timers__table_item': true,
								timers__table_item_enabled: !!timer.timer_status,
								timers__table_item_disabled: !timer.timer_status,
							})}
							key={timer.name + index}
							onClick={() => updateModal(timer)}>
							<div>{timer.name}</div>
							<div>{timer.message}</div>
							<div>{timer.interval}</div>
							<div>{timer.chat_lines}</div>
							<div
								onClick={e => {
									e.stopPropagation();
								}}
								className='timers__table_item_actions'>
								<Switcher
									checked={!!timer.timer_status}
									size='small'
									sx={{
										mr: 1,
									}}
									onChange={async e => {
										const { checked } = e.target;

										try {
											await updateTimer({ timer_id: timer._id, timer_status: checked ? 1 : 0 });
											await refreshTimers();
										} catch (e) {
											console.log('error updating timer', e);
										}
									}}
								/>
								<Confirm
									description={t('TIMER_DELETE_CONFIRM')}
									onYes={() => deleteTimer(timer._id)}>
									<Icon
										name='trash'
										className='timers__table_item_delete'
									/>
								</Confirm>
							</div>
						</div>
					);
				})}
			<hr style={{ marginBottom: 5 }} />
			{timers
				.filter(t => !t.timer_status)
				.map((timer, index) => {
					return (
						<div
							className={className({
								'timers__table_row timers__table_item': true,
								timers__table_item_enabled: !!timer.timer_status,
								timers__table_item_disabled: !timer.timer_status,
							})}
							key={timer.name + index}
							onClick={() => updateModal(timer)}>
							<div>{timer.name}</div>
							<div>{timer.message}</div>
							<div>{timer.interval}</div>
							<div>{timer.chat_lines}</div>
							<div
								onClick={e => {
									e.stopPropagation();
								}}
								className='timers__table_item_actions'>
								<Switcher
									checked={!!timer.timer_status}
									size='small'
									sx={{
										mr: 1,
									}}
									onChange={async e => {
										const { checked } = e.target;

										try {
											await updateTimer({ timer_id: timer._id, timer_status: checked ? 1 : 0 });
											await refreshTimers();
										} catch (e) {
											console.log('error updating timer', e);
										}
									}}
								/>
								<Confirm
									description={t('TIMER_DELETE_CONFIRM')}
									onYes={() => deleteTimer(timer._id)}>
									<Icon
										name='trash'
										className='timers__table_item_delete'
									/>
								</Confirm>
							</div>
						</div>
					);
				})}
		</div>
	);
};

export default TimersTable;
