import { Server } from '@helpers/server';

export const getTimersList = () => Server.get('timer/list').then(({ data }) => data);

export const addTimer = data => Server.post('timer', data);

export const removeTimer = timer_id => Server.delete('timer', { timer_id });

export const updateTimer = data => Server.put('timer', data);
