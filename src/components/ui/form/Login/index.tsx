import { memo } from 'react';
import { theme } from 'theme';
import { Input } from 'components';
import { Card } from 'components/common/Card';
import { AppButton } from 'components/common/Button';
import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { LOGIN_FORM_SCHEMA } from 'config/schema-validators';
type IAuthLoginForm = {
  email: string;
  password: string;
};
type Props = {
  handleLogin: (values: IAuthLoginForm) => void;
  isLoading: boolean;
};

const AuthLoginFormComponent = ({ handleLogin, isLoading }: Props) => {
  const formik = useFormik<IAuthLoginForm>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: LOGIN_FORM_SCHEMA(),
    onSubmit: (values: IAuthLoginForm) => {
      handleLogin(values);
    },
  });

  return (
    <>
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
        <Grid container justifyContent="space-around">
          <Grid item xs={11} md={4}>
            <Card
              elevation={13}
              sx={{ p: 2, background: theme.palette.background.paper }}
            >
              <Box sx={{ my: 3, textAlign: 'center' }}>
                <Typography color="textPrimary" variant="h4">
                  {'SIGN IN'}
                </Typography>
              </Box>
              <form onSubmit={formik.handleSubmit}>
                <Input
                  name="email"
                  type="email"
                  label={'EMAIL'}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={Boolean(formik.touched.email && formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
                <Input
                  name="password"
                  type="password"
                  label={'PASSWORD'}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={Boolean(
                    formik.touched.password && formik.errors.password,
                  )}
                  helperText={formik.touched.password && formik.errors.password}
                />
                {isLoading ? (
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <CircularProgress />
                  </div>
                ) : (
                  <AppButton
                    fullWidth
                    type="submit"
                    sx={{
                      my: 2,
                    }}
                    title={'SUBMIT'}
                  />
                )}
              </form>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export const AuthLoginForm = memo(AuthLoginFormComponent);
