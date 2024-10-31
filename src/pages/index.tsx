import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import DescriptionIcon from '@mui/icons-material/Description';
import InventoryIcon from '@mui/icons-material/Inventory';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import PeopleIcon from '@mui/icons-material/People';
import { Box, Container, Grid, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query';
import { DashboardCard, Layout } from 'components';
import HomeBill from 'components/ui/homeBill';
import HomeInvoice from 'components/ui/homeInvoice';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from 'redux/store';
import { BILL_ADD_URL, INVOICE_ADD_URL, PRODUCT_ADD_URL } from 'routes';
import CustomerService from 'services/customer';
import ProductService from 'services/product';
import VendorService from 'services/vendor';

const DashboardLayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  paddingTop: 64,
  paddingBottom: 64,
}));

function Page() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  const [productCount, setProductCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [vendorCount, setVendorCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const customerService = new CustomerService();
  const productService = new ProductService();
  const vendorService = new VendorService();

  useQuery({
    queryKey: ['ListCustomer'],
    queryFn: async () => {
      try {
        const data = await customerService.CustomerCount(user);
        setCustomerCount(data.data.data.customerCount);
        setLoading(false);
        return data;
      } catch (err) {
        toast.error('Something Went Wrong');
        throw err; // rethrow the error after handling it
      }
    },
    retry: 3,
    refetchOnWindowFocus: false,
  });

  useQuery({
    queryKey: ['ListProduct'],
    queryFn: async () => {
      try {
        const data = await productService.ProductCount(user);
        setProductCount(data?.data.data.productCount);
        setLoading(false);
        return data;
      } catch (err) {
        toast.error('Something Went Wrong');
        throw err; // rethrow the error after handling it
      }
    },
    retry: 3,
    refetchOnWindowFocus: false,
  });

  useQuery({
    queryKey: ['ListVendor'],
    queryFn: async () => {
      try {
        const data = await vendorService.VendorCount(user);
        setVendorCount(data?.data?.data?.vendorCount);
        setLoading(false);
        return data;
      } catch (err) {
        toast.error('Something Went Wrong');
        throw err; // rethrow the error after handling it
      }
    },
    retry: 3,
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <DashboardLayoutRoot>
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          <Container maxWidth={false}>
            <Grid container spacing={3}>
              <Grid item lg={4} sm={6} xl={4} xs={12}>
                <DashboardCard
                  title={'Add Product'}
                  backgroundColor={'#1CC88A'}
                  buttonClick={() => {
                    router.push(PRODUCT_ADD_URL);
                  }}
                  label="Add Product"
                  borderColor={'#1CC88A'}
                  icon={<AddBusinessIcon style={{ fontSize: '45px' }} />}
                />
              </Grid>
              <Grid item lg={4} sm={6} xl={4} xs={12}>
                <DashboardCard
                  title={'Add Invoice'}
                  backgroundColor={'#36B9CC'}
                  buttonClick={() => {
                    router.push(INVOICE_ADD_URL);
                  }}
                  label="Add Invoice"
                  borderColor={'#36B9CC'}
                  icon={<DescriptionIcon style={{ fontSize: '45px' }} />}
                />
              </Grid>
              <Grid item lg={4} sm={6} xl={4} xs={12}>
                <DashboardCard
                  title={'Add Bill'}
                  backgroundColor={'#5A5C69'}
                  label="Add Bill"
                  buttonClick={() => {
                    router.push(BILL_ADD_URL);
                  }}
                  borderColor={'#5A5C69'}
                  icon={<NewspaperIcon style={{ fontSize: '45px' }} />}
                />
              </Grid>
              <Grid item lg={4} sm={6} xl={4} xs={12}>
                <DashboardCard
                  title={'TOTAL PRODUCTS'}
                  loading={loading}
                  backgroundColor={'#1CC88A'}
                  borderColor={'#1CC88A'}
                  paraTitle={JSON.stringify(productCount)}
                  icon={<InventoryIcon style={{ fontSize: '45px' }} />}
                />
              </Grid>
              <Grid item lg={4} sm={6} xl={4} xs={12}>
                <DashboardCard
                  title={'TOTAL CUSTOMERS'}
                  backgroundColor={'#36B9CC'}
                  borderColor={'#36B9CC'}
                  loading={loading}
                  paraTitle={JSON.stringify(customerCount)}
                  icon={<PeopleIcon style={{ fontSize: '45px' }} />}
                />
              </Grid>
              <Grid item lg={4} sm={6} xl={4} xs={12}>
                <DashboardCard
                  title={'TOTAL VENDORS'}
                  backgroundColor={'#5A5C69'}
                  loading={loading}
                  borderColor={'#5A5C69'}
                  paraTitle={JSON.stringify(vendorCount)}
                  icon={<PeopleIcon style={{ fontSize: '45px' }} />}
                />
              </Grid>
            </Grid>
            <Stack
              direction={'row'}
              sx={{
                justifyContent: 'space-between',
                marginTop: '2rem',
              }}
            >
              <HomeInvoice />
              <HomeBill />
            </Stack>
          </Container>
        </Box>
        .
      </DashboardLayoutRoot>
    </>
  );
}

Page.getLayout = (page: JSX.Element) => (
  <Layout heading={'DASHBOARD'}>{page}</Layout>
);

export default Page;
