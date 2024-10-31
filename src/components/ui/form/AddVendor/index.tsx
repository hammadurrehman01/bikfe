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
import { IVendor } from 'interface/vendor';
import { E164Number } from 'libphonenumber-js/types.cjs';
import { useRouter } from 'next/router';
import { memo, useEffect, useState } from 'react';
import 'react-phone-number-input/style.css';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from 'redux/store';
import { VENDOR_LIST_URL } from 'routes';
import VendorService from 'services/vendor';
import VendorAddressList from '../EditVendor/VendorAddressList';
import VendorContactList from '../EditVendor/VendorContactList';

type Props = {
  loading?: boolean;
  title: string;
  listURL: string;
};

const Vendor = ({ loading, title, listURL }: Props) => {
  const router = useRouter();

  const queryClient = useQueryClient();
  const user = useSelector((state: RootState) => state.user);

  const CreateVendor = useMutation({
    mutationFn: async (body: IVendor) => {
      const vendorService = new VendorService();
      const vendorCreated = await vendorService.CreateVendor(body, user);
      return vendorCreated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor'] });
      router.push('/vendor/list');
    },
    onError: (error: any) => {
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.companyName
      ) {
        toast.error('Vendor with this Company Name already exists.');
      } else {
        toast.error('Failed to Create Vendor');
      }
    },
  });

  const handleSubmit = async (value: IVendor) => {
    CreateVendor.mutate(value);
    formik.setFieldValue('companyName', '');
    formik.setFieldValue('website', '');
    formik.setFieldValue('email', '');
    formik.setFieldValue('vendorPhoneNumbers', []);
    formik.setFieldValue('vendorAddresses', []);
  };

  const formik = useFormik({
    initialValues: {
      companyName: '',
      website: '',
      email: '',
      vendorPhoneNumbers: [
        {
          number: '',
          contactPerson: '',
        },
      ],
      vendorAddresses: [
        {
          address: '',
          country: '',
        },
      ],
    },
    validationSchema: CUSTOMER_FORM_SCHEMA_FRONTEND(),
    onSubmit: (value: any) => {
      const filteredAddresses = value.vendorAddresses.filter(item => {
        return item.address && item.country;
      });

      const filteredPhoneNumbers = value.vendorPhoneNumbers.filter(item => {
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
      formik.setFieldTouched('vendorPhoneNumbers', false);
      formik.setFieldTouched('vendorAddresses', false);
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
                router.push(VENDOR_LIST_URL);
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
              {formik.values.vendorPhoneNumbers.map((contact, index) => (
                <VendorContactList
                  key={index}
                  index={index}
                  item={contact}
                  formik={formik}
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
              {formik.values.vendorAddresses.map((address, index: number) => {
                return (
                  <VendorAddressList
                    key={index}
                    index={index}
                    item={address}
                    formik={formik}
                    showButton={false}
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

export const AddVendor = memo(Vendor);
