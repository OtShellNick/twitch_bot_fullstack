import { FC } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Input, Textarea, Checkbox } from '@nextui-org/react';
import { useAddTimerMutation, TTimer, useUpdateTimerMutation } from '@store/timers.api';

interface TimerFormProps {
    timer?: Partial<TTimer>;
    hideForm: () => void;
}

const TimerForm: FC<TimerFormProps> = ({ timer = {}, hideForm }) => {
    const [addTimer] = useAddTimerMutation();
    const [updateTimer] = useUpdateTimerMutation();

    const validationSchema = yup.object({
        name: yup.string().required('Обязательное поле'),
        message: yup
            .string()
            .min(10, `Минимум 10 символов`)
            .max(1500, `Максимум 1500 символов`)
            .required('Обязательное поле'),
        interval: yup
            .number()
            .min(0, `Минимум 1`)
            .max(60, `Максимум 60`)
            .required('Обязательное поле'),
        chat_lines: yup
            .number()
            .min(0, `Минимум 0`)
            .max(60, `Максимум 60`),
        announce: yup
            .number()
            .min(0, `Минимум 0`)
            .max(1, `Максимум 1`),
        timer_status: yup
            .number()
            .min(0, `Минимум 0`)
            .max(1, `Максимум 1`),
    });

    const initialValues: Partial<TTimer> = timer._id ? timer : {
        name: '',
        message: '',
        interval: 1,
        chat_lines: 0,
        announce: 0,
        timer_status: 0,
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true)
            const action = timer._id ? updateTimer : addTimer;

            try {
                await action(values);
                setSubmitting(false);
                hideForm();
            } catch (err) {
                console.log('error add timer', err);
            }
        },
    });

    return <form
        id='addTimerForm'
        onSubmit={formik.handleSubmit}
        className='timers__form'>
        <Input
            name='name'
            fullWidth
            labelLeft="Название"
            placeholder="Это название таймера"
            value={formik.values.name}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            helperColor='error'
            helperText={formik.touched.name && formik.errors.name}
        />
        <Textarea
            name='message'
            color="primary"
            placeholder="Это текст сообщения"
            rows={6}
            value={formik.values.message}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            helperColor='error'
            helperText={formik.touched.message && formik.errors.message}
        />
        <Input
            name='interval'
            fullWidth
            labelLeft="Интервал"
            placeholder="60"
            type='number'
            min='0'
            max='60'
            labelRight='минут'
            value={formik.values.interval}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            helperColor='error'
            helperText={formik.touched.interval && formik.errors.interval}
        />
        <Input
            name='chat_lines'
            fullWidth
            labelLeft="Строки"
            placeholder="14"
            type='number'
            min='0'
            max='30'
            value={formik.values.chat_lines}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            helperColor='error'
            helperText={formik.touched.chat_lines && formik.errors.chat_lines}
        />
        <Checkbox
            name='announce'
            label='Объявление'
            color="primary"
            isRounded
            isSelected={!!formik.values.announce}
            onBlur={formik.handleBlur}
            onChange={checked => formik.setFieldValue('announce', checked ? 1 : 0)} />
        <Checkbox
            name='timer_status'
            label='Включить'
            color="success"
            isRounded
            isSelected={!!formik.values.timer_status}
            onBlur={formik.handleBlur}
            onChange={checked => formik.setFieldValue('timer_status', checked ? 1 : 0)}
        />
    </form>
};

export default TimerForm;