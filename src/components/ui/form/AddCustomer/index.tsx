import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AppButton, Input } from 'components';
import { CUSTOMER_FORM_SCHEMA_FRONTEND } from 'config/schema-validators';
import { useFormik } from 'formik';
import { ICustomer } from 'interface/customer';
import { useRouter } from 'next/router';
import { memo, useEffect, useState } from 'react';
import 'react-phone-number-input/style.css';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from 'redux/store';
import { CUSTOMER_LIST_URL } from 'routes';
import CustomerService from 'services/customer';
import CustomerAddressList from '../EditCustomer/CustomerAddressList';
import CustomerContactList from '../EditCustomer/CustomerContactList';

type Props = {
  loading?: boolean;
  title: string;
  listURL: string;
};

const Customer = ({ loading, title, listURL }: Props) => {
  const router = useRouter();

  const queryClient = useQueryClient();
  const user = useSelector((state: RootState) => state.user);

  const CreateCustomer = useMutation({
    mutationFn: async (body: ICustomer) => {
      const customerService = new CustomerService();
      return await customerService.CreateCustomer(body, user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer'] });
      router.push('/customer/list');
    },
    onError: (error: any) => {
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.companyName
      ) {
        toast.error('Customer with this Company Name already exists.');
      } else {
        toast.error('Failed to Create Customer');
      }
    },
  });

  const handleSubmit = async (value: ICustomer) => {
    CreateCustomer.mutate(value);
    formik.setFieldValue('companyName', '');
    formik.setFieldValue('website', '');
    formik.setFieldValue('email', '');
    formik.setFieldValue('customerPhoneNumbers', []);
    formik.setFieldValue('customerAddresses', []);
  };

  const formik = useFormik<ICustomer>({
    initialValues: {
      companyName: '',
      website: '',
      email: '',
      customerPhoneNumbers: [
        {
          number: '',
          contactPerson: '',
        },
      ],
      customerAddresses: [
        {
          address: '',
          country: '',
        },
      ],
    },
    validationSchema: CUSTOMER_FORM_SCHEMA_FRONTEND(),
    onSubmit: (value: ICustomer) => {
      const filteredAddresses = value.customerAddresses.filter(item => {
        return item.address && item.country;
      });

      const filteredPhoneNumbers = value.customerPhoneNumbers.filter(item => {
        return item.contactPerson && item.number;
      });

      const data = {
        ...value,
        customerAddresses: filteredAddresses,
        customerPhoneNumbers: filteredPhoneNumbers,
      };

      handleSubmit(data);
      formik.setFieldTouched('companyName', false);
      formik.setFieldTouched('website', false);
      formik.setFieldTouched('email', false);
      formik.setFieldTouched('customerPhoneNumbers', false);
      formik.setFieldTouched('customerAddresses', false);
    },
  });

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
            <CardHeader title={title} />
          </div>
          {loading ? (
            <CircularProgress style={{ marginRight: '30px' }} />
          ) : (
            <AppButton
              sx={{ mx: 1, width: '60px', height: '40px', marginRight: '26px' }}
              type="submit"
              title={'Add'}
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
              {formik.values.customerPhoneNumbers.map((contact, index) => (
                <CustomerContactList
                  key={index}
                  formik={formik}
                  index={index}
                  item={contact}
                  showButton={false}
                />
              ))}
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
              {formik.values.customerAddresses.map((address, index: number) => {
                return (
                  <CustomerAddressList
                    key={index}
                    index={index}
                    item={address}
                    showButton={false}
                    formik={formik}
                  />
                );
              })}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
};

export const AddCustomer = memo(Customer);
