import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { TextField, Button, ButtonGroup, styled, Typography, FormControlLabel, Checkbox, colors } from '@mui/material';

import CustomSlider from '@containers/Slider/Slider';

import { addTimer, updateTimer } from '@actions/timers.actions';

const TimerForm = ({ hideForm, timer }) => {
	const { deepPurple } = colors;
	const { t } = useTranslation();

	const validationSchema = yup.object({
		name: yup.string(t('VALIDATION_ERROR_STRING')).required(t('VALIDATION_ERROR_REQUIRED')),
		message: yup
			.string(t('VALIDATION_ERROR_STRING'))
			.min(10, `${t('VALIDATION_ERROR_MIN_LENGTH')} 10`)
			.max(1500, `${t('VALIDATION_ERROR_MAX_LENGTH')} 1500`)
			.required(t('VALIDATION_ERROR_REQUIRED')),
		interval: yup
			.number(t('VALIDATION_ERROR_NUMBER'))
			.min(1, `${t('VALIDATION_ERROR_MIN_LENGTH')} 1`)
			.max(60, `${t('VALIDATION_ERROR_MAX_LENGTH')} 60`)
			.required(t('VALIDATION_ERROR_REQUIRED')),
		chat_lines: yup
			.number(t('VALIDATION_ERROR_NUMBER'))
			.min(0, `${t('VALIDATION_ERROR_MIN_LENGTH')} 0`)
			.max(60, `${t('VALIDATION_ERROR_MAX_LENGTH')} 60`),
		announce: yup
			.number(t('VALIDATION_ERROR_NUMBER'))
			.min(0, `${t('VALIDATION_ERROR_MIN_LENGTH')} 0`)
			.max(1, `${t('VALIDATION_ERROR_MAX_LENGTH')} 1`),
		timer_status: yup
			.number(t('VALIDATION_ERROR_NUMBER'))
			.min(0, `${t('VALIDATION_ERROR_MIN_LENGTH')} 0`)
			.max(1, `${t('VALIDATION_ERROR_MAX_LENGTH')} 1`),
	});

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

	const initialValues = timer
		? { ...timer, timer_id: timer._id }
		: {
				name: '',
				message: '',
				interval: 1,
				chat_lines: 0,
				announce: 0,
				timer_status: 0,
		  };

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: async (values, { setSubmitting }) => {
			setSubmitting(true);
			const action = timer ? updateTimer : addTimer;

			try {
				await action(values);
				setSubmitting(true);
				hideForm();
			} catch (err) {
				console.log('error add timer', err);
			}
		},
	});

	return (
		<form
			onSubmit={formik.handleSubmit}
			className='timers__form'>
			<TextField
				required
				name='name'
				onChange={formik.handleChange}
				value={formik.values.name}
				placeholder={t('TIMER_PLACEHOLDER_NAME')}
				variant='standard'
				error={formik.touched.name && Boolean(formik.errors.name)}
				helperText={formik.touched.name && formik.errors.name}
			/>
			<p>{t('TIMER_NAME_DESCRIPTION')}</p>
			<TextField
				required
				name='message'
				multiline
				placeholder={t('TIMER_PLACEHOLDER_MESSAGE')}
				value={formik.values.message}
				onChange={formik.handleChange}
				variant='standard'
				error={formik.touched.message && Boolean(formik.errors.message)}
				helperText={formik.touched.message && formik.errors.message}
			/>
			<p>{t('TIMER_MESSAGE_DESCRIPTION')}</p>
			<CustomSlider
				key={1}
				name='interval'
				min={1}
				max={60}
				step={1}
				value={formik.values.interval > 60 ? formik.values.interval / 1000 : formik.values.interval}
				valueLabelDisplay='auto'
				onChange={({ target: { name, value } }) => {
					formik.setFieldValue(name, value, true);
				}}
				aria-labelledby='interval'
			/>
			<Typography
				id='interval'
				gutterBottom>
				{`${t('EVERY')} ${
					formik.values.interval > 60 ? formik.values.interval / 1000 : formik.values.interval
				}${t('S')}`}
			</Typography>
			<p>{t('TIMER_INTERVAL_DESCRIPTION')}</p>
			<CustomSlider
				name='chat_lines'
				valueLabelDisplay='auto'
				min={0}
				max={100}
				step={1}
				value={formik.values.chat_lines}
				onChange={({ target: { name, value } }) => {
					formik.setFieldValue(name, value, true);
				}}
				aria-labelledby='chat_lines'
			/>
			<Typography
				id='chat-lines'
				gutterBottom>
				{`${t('EVERY')} ${formik.values.chat_lines}`}
			</Typography>
			<p>{t('TIMER_CHAT_LINES_DESCRIPTION')}</p>
			<FormControlLabel
				value={formik.values.announce}
				control={
					<Checkbox
						checked={!!formik.values.announce}
						onChange={(e, v) => {
							formik.setFieldValue('announce', v ? 1 : 0, true);
						}}
						sx={{
							color: deepPurple[800],
							'&.Mui-checked': {
								color: deepPurple[600],
							},
						}}
					/>
				}
				label={t('TIMER_ANNOUNCEMENT_LABEL')}
				labelPlacement='end'
			/>
			<p>{t('TIMER_ANNOUNCEMENT_DESCRIPTION')}</p>
			<FormControlLabel
				value={formik.values.timer_status}
				control={
					<Checkbox
						checked={!!formik.values.timer_status}
						onChange={(e, v) => {
							formik.setFieldValue('timer_status', v ? 1 : 0, true);
						}}
						sx={{
							color: deepPurple[800],
							'&.Mui-checked': {
								color: deepPurple[600],
							},
						}}
					/>
				}
				label={t('TIMER_STATUS_LABEL')}
				labelPlacement='end'
			/>
			<p>{t('TIMER_STATUS_DESCRIPTION')}</p>
			<hr />
			<ButtonGroup
				variant='outlined'
				aria-label='outlined button group'
				disabled={formik.isSubmitting}>
				<ButtonAdd
					variant='contained'
					size='medium'
					type='submit'>
					{timer ? t('UPDATE_TIMER') : t('ADD_TIMER')}
				</ButtonAdd>
				<ButtonCancel
					variant='contained'
					size='medium'
					onClick={hideForm}
					color='error'>
					{t('CLOSE_MODAL')}
				</ButtonCancel>
			</ButtonGroup>
			<div style={{ minHeight: 25 }} />
		</form>
	);
};

export default TimerForm;
