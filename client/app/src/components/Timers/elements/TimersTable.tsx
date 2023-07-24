'use client';
import { useState, memo, useEffect } from 'react';
import { Table, Badge, Button, Modal } from '@nextui-org/react';

import { useGetTimersListQuery, useDeleteTimerMutation } from '@store/timers.api';

import TimerForm from './TimerForm';

import IconEdit from '/public/icons/edit.svg?tsx';
import IconDelete from '/public/icons/trash.svg?tsx';

import { TTimer } from '@store/timers.api';

const TimersTable = ({ timers }: { timers: TTimer[] }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [timer, setTimer] = useState({});
    // const { data: timers, isSuccess, refetch } = useGetTimersListQuery(null);
    const [deleteTimer] = useDeleteTimerMutation();

    const columns = [
        { name: "Название", uid: "name" },
        { name: "Сообщение", uid: "message" },
        { name: "Интервал", uid: "interval" },
        { name: "Строки чата", uid: "chat_lines" },
        { name: 'Объявление', uid: 'announce' },
        { name: "Статус", uid: "timer_status" },
        { name: "Действия", uid: "actions" },
    ];

    const renderCell = (timer, columnKey) => {
        const cellValue = timer[columnKey];

        switch (columnKey) {
            case 'actions':
                return (
                    <Button.Group size='sm' color='secondary' ghost>
                        <Button auto onPress={(e) => {
                            console.log('edit')
                            setIsOpen(true);
                            setTimer(timer);
                        }} icon={<IconEdit />} />
                        <Button auto onPress={async (e) => {
                            console.log('delete');
                            try {
                                await deleteTimer({ timer_id: timer._id });
                                // await refetch();
                            } catch (err) {
                                console.log('Delete timer error', err);
                            }
                        }} icon={<IconDelete />} />
                    </Button.Group>
                );
            case 'announce':
            case 'timer_status':
                return (
                    <Badge variant='flat' color={cellValue === 1 ? 'success' : 'error'}>
                        {cellValue === 1 ? 'Включен' : 'Выключен'}
                    </Badge>
                );
            default:
                return cellValue;
        }
    };

    return <div>
        <Modal
            closeButton
            blur
            open={isOpen}
            onClose={() => {
                setIsOpen(false);
                setTimer({});
                // refetch();
            }}
        >
            <Modal.Header>
                Обновить таймер
            </Modal.Header>
            <Modal.Body>
                <TimerForm timer={timer} hideForm={() => setIsOpen(false)} />
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
                    Обновить
                </Button>
            </Modal.Footer>
        </Modal>
        <Table
            id='timers'
            aria-label="Timers table"
            selectionMode='none'
            css={{
                height: "auto",
                minWidth: "100%",
            }}
            onCellAction={e => console.log('cell action', e)}
            onRowAction={e => console.log('row action', e)}
            disabledKeys='all'
        >
            <Table.Header columns={columns}>
                {(column) => <Table.Column key={column.uid}>
                    {column.name}
                </Table.Column>}
            </Table.Header>
            <Table.Body items={timers}>
                {(item) => <Table.Row key={item._id}>
                    {(columnKey) => <Table.Cell key={columnKey + item._id}>{renderCell(item, columnKey)}</Table.Cell>}
                </Table.Row>}
            </Table.Body>
            <Table.Pagination
                shadow
                noMargin
                align="center"
                rowsPerPage={5}
                onPageChange={(page) => console.log({ page })}
            />
        </Table>
    </div>
};

export default memo(TimersTable);