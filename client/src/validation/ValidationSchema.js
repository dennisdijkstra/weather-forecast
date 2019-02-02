import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    location: Yup
        .string()
        .required('Location is required'),
    date: Yup
        .date()
        .required('Date is required')
        .typeError('Date is required'),
});

export default validationSchema;
