import React, { useMemo } from 'react';
import { Slider, styled } from '@mui/material';

const CustomSlider = props => {
	const PrettoSlider = useMemo(
		() =>
			styled(Slider)({
				color: 'var(--primary-600)',
				height: 8,
				'& .MuiSlider-track': {
					border: 'none',
				},
				'& .MuiSlider-thumb': {
					height: 24,
					width: 24,
					backgroundColor: 'var(--gray-50)',
					border: '2px solid currentColor',
					'&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
						boxShadow: 'inherit',
					},
					'&:before': {
						display: 'none',
					},
				},
				'& .MuiSlider-valueLabel': {
					lineHeight: 1.2,
					fontSize: 12,
					background: 'unset',
					padding: 0,
					width: 32,
					height: 32,
					borderRadius: '50% 50% 50% 0',
					backgroundColor: 'var(--primary-600)',
					transformOrigin: 'bottom left',
					transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
					'&:before': { display: 'none' },
					'&.MuiSlider-valueLabelOpen': {
						transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
					},
					'& > *': {
						transform: 'rotate(45deg)',
					},
				},
			}),
		[props.name],
	);

	return <PrettoSlider {...props} />;
};

export default CustomSlider;
