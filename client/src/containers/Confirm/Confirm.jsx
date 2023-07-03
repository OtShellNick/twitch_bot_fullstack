import React, { useState } from 'react';
import { ButtonGroup, Button, styled } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Modal from '@containers/Modal/Modal';

import './Confirm.scss';

const Confirm = ({ children, description, onYes }) => {
	const [isOpen, setIsOpen] = useState(false);
	const { t } = useTranslation();

	const ButtonAdd = styled(Button)({
		backgroundColor: 'var(--primary-700)',
		'&:hover': {
			backgroundColor: 'var(--primary-800)',
		},
	});
	const ButtonCancel = styled(Button)({
		backgroundColor: 'var(--red-600)',
		'&:hover': {
			backgroundColor: 'var(--red-700)',
		},
	});

	const closeConfirm = () => setIsOpen(false);

	return (
		<div
			onClick={e => {
				e.stopPropagation();
				if (!isOpen) setIsOpen(true);
			}}
			className='confirm__wrapper'>
			<Modal
				title={t('CONFITM_TITLE')}
				isOpen={isOpen}
				onRequestClose={closeConfirm}>
				<div className='confirm'>
					<p>{description}</p>
					<hr />
					<ButtonGroup
						variant='outlined'
						aria-label='outlined button group'>
						<ButtonAdd
							variant='contained'
							size='medium'
							onClick={onYes}>
							{t('YES')}
						</ButtonAdd>
						<ButtonCancel
							variant='contained'
							size='medium'
							onClick={closeConfirm}>
							{t('NO')}
						</ButtonCancel>
					</ButtonGroup>
				</div>
			</Modal>
			{children}
		</div>
	);
};

export default Confirm;
