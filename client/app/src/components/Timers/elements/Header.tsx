'use client';

import { useState } from 'react';
import { Button, Modal } from '@nextui-org/react';
import { useGetTimersListQuery } from '@store/timers.api';

import TimerForm from './TimerForm';

const Header = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { refetch } = useGetTimersListQuery(null);

    return <div className='timers__header'>
        <Modal
            closeButton
            blur
            open={isOpen}
            onClose={() => {
                setIsOpen(false);
                refetch();
            }}
        >
            <Modal.Header>
                Создать таймер
            </Modal.Header>
            <Modal.Body>
                <TimerForm hideForm={() => setIsOpen(false)} />
            </Modal.Body>
            <Modal.Footer>
                <Button
                    auto
                    color="error"
                    onPress={() => setIsOpen(false)}>
                    Закрыть
                </Button>
                <Button
                    auto
                    form='addTimerForm'
                    type='submit'>
                    Создать
                </Button>
            </Modal.Footer>
        </Modal>
        <div className='timers__header_left'>
            <h1 className='timers__header_heading'>Таймеры</h1>
        </div>
        <div className='timers__header_right'>
            <Button size='sm' color="secondary" onPress={() => setIsOpen(true)}>Добавить таймер</Button>
        </div>
    </div>
};

export default Header;