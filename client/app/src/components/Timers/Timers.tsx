import './Timers.scss';

import Header from './elements/Header';
import TimersTable from './elements/TimersTable';

export const Timers = ({ timers }) => {

    return <main className='timers'>
        <Header />
        <TimersTable timers={timers} />
    </main>
};