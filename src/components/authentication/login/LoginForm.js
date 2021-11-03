import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import PropTypes from 'prop-types';
// material
import {
  Link,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Collapse,
  Alert,
  AlertTitle
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

LoginForm.propTypes = {
  login: PropTypes.func,
  clearlogin: PropTypes.func
};

export default function LoginForm({ login, clearlogin }) {
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

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .required('Username is required')
      .test('whitespace', 'Username cant have whitespace', (value) => value?.search(' ') === -1),
    password: Yup.string().required('Password is required')
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      remember: false
    },
    validationSchema: LoginSchema,
    onSubmit: ({ email, password, remember }) => {
      dispatch(
        login({
          username: email,
          password,
          remember
        })
      );
      // navigate('/dashboard', { replace: true });
    }
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setSubmitting } =
    formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="username"
            type="text"
            label="Email or Username"
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
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <FormControlLabel
            control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
            label="Remember me"
          />

          <Link component={RouterLink} variant="subtitle2" to="#">
            Forgot password?
          </Link>
        </Stack>

        <Stack spacing={3}>
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
        </Stack>
        <br />
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Login
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
