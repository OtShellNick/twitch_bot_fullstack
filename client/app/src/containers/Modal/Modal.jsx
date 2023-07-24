'use client';

import M from 'react-modal';

import IconClose from './public/close.svg?tsx';

import './Modal.scss';

const Modal = ({ title, isOpen, onRequestClose, onAfterOpen, contentLabel, children }) => {
	M.setAppElement('#root');

	const styles = {
		content: {
			padding: 0,
			transform: 'translate(-50%, -50%)',
		},
	};

	return (
		<M
			style={styles}
			isOpen={isOpen}
			onAfterOpen={onAfterOpen}
			onRequestClose={onRequestClose}
			contentLabel={contentLabel}>
			<div className='modal__header'>
				{title && <h2 className='modal__header_title'>{title}</h2>}
				<IconClose
					name='close'
					className='modal__header_close'
					onClick={onRequestClose}
				/>
			</div>
			{children}
		</M>
	);
};

export default Modal;
