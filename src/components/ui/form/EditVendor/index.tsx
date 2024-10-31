import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { AppButton, Input } from 'components';
import { CUSTOMER_UPDATED_FORM_SCHEMA_FRONTEND } from 'config/schema-validators';
import { useFormik } from 'formik';
import { IVendor, TAddress, TContact } from 'interface/vendor';
import { E164Number } from 'libphonenumber-js/types.cjs';
import { useRouter } from 'next/router';
import { memo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { VENDOR_LIST_URL } from 'routes';
import VendorService from 'services/vendor';
import VendorAddressList from './VendorAddressList';
import VendorContactList from './VendorContactList';
import DataNotFound from 'components/common/DataNotFound';

type Props = {
  handleSubmit: (value: IVendor) => void;
  data: any | undefined;
  loading?: boolean;
};
const Vendor = ({ handleSubmit, data, loading }: Props) => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  const pid = router.query.pid;

  if (data?.id && data?.id != router.query.pid) {
    router.replace('/');
    return <DataNotFound title="Vendor" />;
  }

  const vendorService = new VendorService();

  const { data: vendorPhone, isLoading: vendorPhoneLoading } = useQuery({
    queryKey: ['vendorPhone'],
    queryFn: async () => await vendorService.GetVendorPhone(pid, user),
  });

  const { data: vendorAddress, isLoading: vendorAddressLoading } = useQuery({
    queryKey: ['vendorAddress'],
    queryFn: async () => await vendorService.GetVendorAddress(pid, user),
  });

  const vendorPhoneExist = vendorPhone && vendorPhone.data.data.length !== 0;
  const vendorAddressExist =
    vendorAddress && vendorAddress.data.data.length !== 0;

  const formik = useFormik({
    initialValues: {
      companyName: data?.companyName || '',
      website: data?.website || '',
      email: data?.email || '',
      vendorPhoneNumbers: vendorPhoneExist
        ? vendorPhone?.data?.data
        : [
            {
              number: '',
              contactPerson: '',
            },
          ],
      vendorAddresses: vendorAddressExist
        ? vendorAddress?.data?.data
        : [
            {
              address: '',
              country: '',
            },
          ],
    },
    enableReinitialize: true,
    validationSchema: CUSTOMER_UPDATED_FORM_SCHEMA_FRONTEND(),
    onSubmit: (value: any) => {
      handleSubmit(value);
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
            <CardHeader title={'Update Vendor'} />
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
              {vendorPhoneLoading ? (
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
                formik.values.vendorPhoneNumbers.map((contact, index) => (
                  <VendorContactList
                    key={index}
                    index={index}
                    item={contact}
                    showButton={true}
                    formik={formik}
                  />
                ))
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
              {vendorAddressLoading ? (
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
                formik.values.vendorAddresses.map((address, index: number) => {
                  return (
                    <VendorAddressList
                      key={index}
                      formik={formik}
                      index={index}
                      item={address}
                      showButton={true}
                    />
                  );
                })
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
};

export const EditVendor = memo(Vendor);
