import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useFormik, Form, FormikProvider } from 'formik';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// material
import {
  Stack,
  TextField,
  IconButton,
  InputAdornment,
  Alert,
  Collapse,
  AlertTitle
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import PropTypes from 'prop-types';
// import CloseIcon from '@mui/icons-material/Close';

// ----------------------------------------------------------------------

RegisterForm.propTypes = {
  register: PropTypes.func,
  clearlogin: PropTypes.func
};

export default function RegisterForm({ register, clearlogin }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showerror, setShowerror] = useState(false);
  const [showerrorMessage, setShowerrorMessage] = useState('Error : No Response While Submmiting');
  const dispatch = useDispatch();
  const authenticationStore = useSelector((state) => state.authentication);

  useEffect(() => {
    if (authenticationStore.status === 'idle') {
      setSubmitting(false);
      if (authenticationStore.data.login?.status === 'success') {
        if (showerror === true) setShowerror(false);
        navigate('/dashboard', { replace: true });
      } else if (authenticationStore.data.login?.status === 'fail') {
        setShowerrorMessage(authenticationStore.data.login.message);
        setShowerror(true);
        // setTimeout(() => {
        //   setShowerror(false);
        // }, 5000);
      }
    }
  }, [authenticationStore]);

  // useEffect(() => {
  //   if (showerror === false) {
  //     dispatch(clearlogin());
  //   }
  // }, [showerror]);

  const RegisterSchema = Yup.object().shape({
    userName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Username required')
      .test('whitespace', 'Username cant have whitespace', (value) => value?.search(' ') === -1),
    // lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Last name required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
    confirmPassword: Yup.string()
      .when('password', {
        is: (val) => !!(val && val.length > 0),
        then: Yup.string().oneOf([Yup.ref('password')], 'Both password need to be the same')
      })
      .required('Password is required')
  });

  const formik = useFormik({
    initialValues: {
      userName: '',
      // lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: ({ userName, email, password }) => {
      dispatch(
        register({
          username: userName,
          password,
          email,
          usertype: 'normal'
        })
      );
      // navigate('/dashboard', { replace: true });
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setSubmitting } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}> */}
          <TextField
            fullWidth
            label="User Name"
            {...getFieldProps('userName')}
            error={Boolean(touched.userName && errors.userName)}
            helperText={touched.userName && errors.userName}
          />

          {/* <TextField
              fullWidth
              label="Last name"
              {...getFieldProps('lastName')}
              error={Boolean(touched.lastName && errors.lastName)}
              helperText={touched.lastName && errors.lastName}
            /> */}
          {/* </Stack> */}

          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email address"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type="password"
            label="Confirm Password"
            {...getFieldProps('confirmPassword')}
            // InputProps={{
            //   endAdornment: (
            //     <InputAdornment position="end">
            //       <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
            //         <Icon icon={showPassword ? eyeFill : eyeOffFill} />
            //       </IconButton>
            //     </InputAdornment>
            //   )
            // }}
            error={Boolean(touched.confirmPassword && errors.confirmPassword)}
            helperText={touched.confirmPassword && errors.confirmPassword}
          />

          <Collapse in={showerror}>
            <Alert
              severity="error"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setShowerror(false);
                  }}
                >
                  {/* <CloseIcon fontSize="inherit" /> */}X
                </IconButton>
              }
              sx={{ mb: 2 }}
            >
              <AlertTitle>Error</AlertTitle>
              {showerrorMessage}
            </Alert>
          </Collapse>

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Register
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
