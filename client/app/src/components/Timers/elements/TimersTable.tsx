'use client';

import { useGetTimersListQuery } from '@store/timers.api';

const TimersTable = () => {
    const { data: timers } = useGetTimersListQuery(null);

    console.log('timers', timers);

    return <div className='timers__table'>
        <div className='timers__table_row timers__table_header'>
            <div>Название</div>
            <div>Сообщение</div>
            <div>Интервал</div>
            <div>Строки чата</div>
            <div>Действия</div>
        </div>
    </div>
};

export default TimersTable;