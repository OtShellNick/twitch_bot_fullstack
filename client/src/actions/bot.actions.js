import { Server } from '@helpers/server';

export const switchOnBot = () => Server.post('bot/switch-on');

export const switchOffBot = () => Server.post('bot/switch-off');
