import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useQuery } from '@tanstack/react-query';
import { AppButton, Input } from 'components';
import { CUSTOMER_UPDATED_FORM_SCHEMA_FRONTEND } from 'config/schema-validators';
import { useFormik } from 'formik';
import { ICustomer, IListCustomer } from 'interface/customer';
import { useRouter } from 'next/router';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { CUSTOMER_LIST_URL } from 'routes';
import CustomerService from 'services/customer';
import CustomerAddressList from './CustomerAddressList';
import CustomerContactList from './CustomerContactList';
import DataNotFound from 'components/common/DataNotFound';

type Props = {
  handleSubmit: (value: ICustomer) => void;
  data?: IListCustomer;
  loading?: boolean;
};
const Customer = ({ handleSubmit, data, loading }: Props) => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  const pid = router.query.pid;
  const customerService = new CustomerService();

  const validateData = (data?: IListCustomer) => {
    if (data && router.query.pid != data?.id) {
      router.replace('/');
      return <DataNotFound title="Customer" />;
    }
  };

  const fetchCustomerPhone = () => {
    return useQuery({
      queryKey: ['customerPhone'],
      queryFn: async () => await customerService.GetCustomerPhone(pid, user),
    });
  };

  const fetchCustomerAddress = () => {
    return useQuery({
      queryKey: ['customerAddress'],
      queryFn: async () => await customerService.GetCustomerAddress(pid, user),
    });
  };

  const { data: customerPhone, isLoading: customerPhoneLoading } =
    fetchCustomerPhone();
  const { data: customerAddress, isLoading: customerAddressLoading } =
    fetchCustomerAddress();

  const customerPhoneExist =
    customerPhone && customerPhone.data.data.length !== 0;
  const customerAddressExist =
    customerAddress && customerAddress.data.data.length !== 0;

  const formik = useFormik<ICustomer>({
    initialValues: {
      companyName: data?.companyName || '',
      website: data?.website || '',
      email: data?.email || '',
      customerPhoneNumbers: customerPhoneExist
        ? customerPhone.data.data
        : [
            {
              number: '',
              contactPerson: '',
            },
          ],
      customerAddresses: customerAddressExist
        ? customerAddress.data.data
        : [
            {
              address: '',
              country: '',
            },
          ],
    },
    enableReinitialize: true,
    validationSchema: CUSTOMER_UPDATED_FORM_SCHEMA_FRONTEND(),
    onSubmit: (value: ICustomer) => {
      handleSubmit(value);
    },
  });

  // Validate data
  validateData(data);
  return (
    <form
      onSubmit={formik.handleSubmit}
      style={{ width: '100%', margin: '0rem 1rem' }}
    >
      <Card>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <KeyboardBackspaceIcon
              style={{
                fontSize: '40px',
                cursor: 'pointer',
                marginLeft: '20px',
              }}
              onClick={() => {
                router.push(CUSTOMER_LIST_URL);
              }}
            />
            <CardHeader title={'Update Customer'} />
          </div>
          {loading ? (
            <CircularProgress style={{ marginRight: '30px' }} />
          ) : (
            <AppButton
              sx={{ mx: 1, width: '60px', height: '40px', marginRight: '26px' }}
              type="submit"
              title={'Update'}
            />
          )}
        </div>

        <Divider style={{ borderColor: '#E6E8F0' }} />
        <CardContent>
          <Grid container spacing={{ xs: 0, md: 3 }}>
            <Grid item md={6} xs={12}>
              <Input
                name="companyName"
                label={'Company Name *'}
                value={formik.values.companyName}
                onChange={formik.handleChange}
                helperText={
                  formik.touched.companyName && formik.errors.companyName
                }
                error={Boolean(
                  formik.touched.companyName && formik.errors.companyName,
                )}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Input
                name="website"
                label={'Website'}
                value={formik.values.website}
                onChange={formik.handleChange}
                helperText={formik.touched.website && formik.errors.website}
                error={Boolean(formik.touched.website && formik.errors.website)}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <Input
                name="email"
                label={'Email'}
                value={formik.values.email}
                onChange={formik.handleChange}
                helperText={formik.touched.email && formik.errors.email}
                error={Boolean(formik.touched.email && formik.errors.email)}
              />
            </Grid>
            <Grid item md={6} xs={12}></Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <Typography
                sx={{
                  textAlign: 'center',
                  fontSize: '24px',
                  fontWeight: 'bold',
                }}
              >
                Contacts
              </Typography>
              {customerPhoneLoading ? (
                <Stack
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                  }}
                >
                  <CircularProgress sx={{ textAlign: 'center' }} />
                </Stack>
              ) : (
                formik.values.customerPhoneNumbers.map(
                  (contact: any, index) => (
                    <CustomerContactList
                      key={index}
                      formik={formik}
                      index={index}
                      item={contact}
                      showButton={true}
                    />
                  ),
                )
              )}
            </Grid>

            <Grid item md={6} xs={12}>
              <Typography
                sx={{
                  textAlign: 'center',
                  fontSize: '24px',
                  fontWeight: 'bold',
                }}
              >
                Addresses
              </Typography>
              {customerAddressLoading ? (
                <Stack
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                  }}
                >
                  <CircularProgress sx={{ textAlign: 'center' }} />
                </Stack>
              ) : (
                formik.values.customerAddresses.map(
                  (address, index: number) => {
                    return (
                      <CustomerAddressList
                        key={index}
                        index={index}
                        item={address}
                        showButton={true}
                        formik={formik}
                      />
                    );
                  },
                )
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
};

export const EditCustomer = memo(Customer);
