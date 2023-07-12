'use client'

import './Dashboard.scss';

import { Switch, } from '@nextui-org/react';

import { useUserUpdateMutation, useGetSelfQuery } from '@store/api';


const Dashboard = () => {
    const { data: user, isSuccess } = useGetSelfQuery(null);
    const [updateUser, data] = useUserUpdateMutation();


    if (isSuccess) return <main>
        Main
        <Switch checked={!!user.bot_status} bordered size="sm" color="secondary" shadow animated onClick={(e) => {
            const { checked } = e.target as HTMLInputElement;
            if (checked !== undefined) {
                console.log('cheked', checked);
                updateUser({ bot_status: checked ? 1 : 0 });
            }
        }} />
    </main>
};

export default Dashboard;