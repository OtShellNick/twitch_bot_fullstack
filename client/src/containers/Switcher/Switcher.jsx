import React from 'react';
import { Switch, styled } from '@mui/material';

import './Switcher.scss';

const Switcher = props => {
	const IOSSwitch = styled(props => (
		<Switch
			focusVisibleClassName='.Mui-focusVisible'
			disableRipple
			{...props}
		/>
	))(({ theme }) => ({
		width: 40,
		height: 24,
		padding: 0,
		'& .MuiSwitch-switchBase': {
			padding: 0,
			margin: 4,
			transitionDuration: '300ms',
			'&.Mui-checked': {
				transform: 'translateX(16px)',
				color: '#fff',
				'& + .MuiSwitch-track': {
					backgroundColor: theme.palette.mode === 'dark' ? 'var(--primary-100)' : 'var(--primary-600)',
					opacity: 1,
					border: 0,
				},
				'&.Mui-disabled + .MuiSwitch-track': {
					opacity: 0.5,
				},
			},
			'&.Mui-focusVisible .MuiSwitch-thumb': {
				color: '#33cf4d',
				border: '6px solid #fff',
			},
			'&.Mui-disabled .MuiSwitch-thumb': {
				color: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[600],
			},
			'&.Mui-disabled + .MuiSwitch-track': {
				opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
			},
		},
		'& .MuiSwitch-thumb': {
			boxSizing: 'border-box',
			width: 16,
			height: 16,
		},
		'& .MuiSwitch-track': {
			borderRadius: 26 / 2,
			backgroundColor: theme.palette.mode === 'light' ? 'var(--gray-400)' : '#39393D',
			opacity: 1,
			transition: theme.transitions.create(['background-color'], {
				duration: 500,
			}),
		},
	}));

	return <IOSSwitch {...props} />;
};

export default Switcher;
