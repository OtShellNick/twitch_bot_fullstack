import './Timers.scss';

import Header from './elements/Header';
import TimersTable from './elements/TimersTable';

export const Timers = () => {

    return <main className='timers'>
        <Header />
        <TimersTable />
    </main>
};