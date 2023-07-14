'use client';

import { Button } from '@nextui-org/react';

const Header = () => {

    return <div className='timers__header'>
        <div className='timers__header_left'>
            <h1 className='timers__header_heading'>Таймеры</h1>
        </div>
        <div className='timers__header_right'>
            <Button>Добавить таймер</Button>
        </div>
    </div>
};

export default Header;