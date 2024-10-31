import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import {
  Autocomplete,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  Box,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { AppButton, AppLoader, Dropdown, Input, Layout } from 'components';
import { useCustomerData } from 'hooks/useCustomerData';
import { useVendorData } from 'hooks/useVendorData';
import { ErrorResponse } from 'interface/ApiError';
import { ICustomerMapping, ICustomers } from 'interface/customer';
import { CreateProductInput } from 'interface/product';
import { IListVendor, IVendorMapping } from 'interface/vendor';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from 'redux/store';
import { PRODUCT_LIST_URL } from 'routes';
import CustomerService from 'services/customer';
import ProductService from 'services/product';
import { GetAssetFromS3ByKey } from 'services/storage.service';
import VendorService from 'services/vendor';

export default function Page() {
  const [product, setProduct] = useState<CreateProductInput>();
  const user = useSelector((state: RootState) => state.user);
  const [select, setSelect] = useState('');
  const [selectedID, setSelectedID] = useState('');
  const [search, setSearch] = useState('');
  const [code, setCode] = useState('');
  const router = useRouter();
  const pid = router.query.pid;
  const productService = new ProductService();
  const customerService = new CustomerService();
  const vendorService = new VendorService();

  const { customers, handleScroll: handleCustomerScroll } = useCustomerData(
    search,
    true,
  );
  const { vendors, handleVendorScroll } = useVendorData(search, true);

  const customersData: ICustomers = customers.map((itm, i) => {
    return { ...itm, label: itm.companyName };
  });
  const vendorData: IListVendor[] = vendors.map((itm, i) => {
    return { ...itm, label: itm.companyName };
  });

  const emptyAllFields = () => {
    setCode('');
    setSearch('');
    setSelect('');
    setSelectedID('');
  };

  const query = useQuery({
    queryKey: ['GetProduct', pid],
    queryFn: async () => {
      const response = await productService.GetProductById(pid, user);
      if (response) {
        setProduct(response.data.data);
      }
      if (response) {
        let fileUrl = response?.data?.data?.image as string;

        if (fileUrl) {
          fileUrl = await GetAssetFromS3ByKey(fileUrl);
        }
        return { ...response?.data?.data, image: fileUrl };
      }
      return null; // or handle the case where data is null
    },
    retry: 3,
    refetchOnWindowFocus: false,
  });

  const createMappingWithCustomer = useMutation({
    mutationFn: async (body: ICustomerMapping) =>
      await customerService.CreateCustomerMapping(
        selectedID,
        body as any,
        user as any,
      ),
    onSuccess: () => {
      toast.success('Mapping with Customer Added Successfully');
      emptyAllFields();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error?.response?.data?.error || 'Something Went Wrong');
      emptyAllFields();
    },
  });

  const createMappingWithVendor = useMutation({
    mutationFn: async (body: IVendorMapping) =>
      await vendorService.CreateVendorMapping(
        selectedID,
        body as any,
        user as any,
      ),
    onSuccess: () => {
      toast.success('Mapping with Vendor Added Successfully');
      emptyAllFields();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error?.response?.data?.error || 'Something Went Wrong');
      emptyAllFields();
    },
  });

  async function handleSubmit() {
    if (select == 'Customer' && selectedID && code) {
      createMappingWithCustomer.mutate({
        customerId: selectedID,
        code: code,
        productId: product?.id,
      });
    } else if (select == 'Vendor' && selectedID && code) {
      createMappingWithVendor.mutate({
        vendorId: selectedID,
        code: code,
        productId: product?.id,
      });
    } else {
      if (!selectedID) {
        toast.error(`Enter the ${select}'s Company Name`);
        return;
      }
      if (!code) {
        toast.error('Enter Product Code');
        return;
      }
    }
  }
  return (
    <Box>
      <Box sx={{ my: 3, width: '80%', margin: 'auto', paddingTop: '50px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <div style={{ display: 'flex' }}>
              <KeyboardBackspaceIcon
                style={{
                  fontSize: '40px',
                  cursor: 'pointer',
                  marginLeft: '20px',
                  marginTop: '10px',
                  marginRight: '30px',
                }}
                onClick={() => {
                  router.push(PRODUCT_LIST_URL);
                }}
              />
            </div>

            <Card sx={{ width: '80%' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: '20px',
                }}
              >
                {query.isLoading ? (
                  <AppLoader sx={{ height: '10vh', margin: 'auto' }} />
                ) : (
                  <img
                    style={{ margin: 'auto' }}
                    alt={'Product Image'}
                    src={
                      query?.data?.image ?? '/images/products/default-img.png'
                    }
                    width={150}
                    height={150}
                  />
                )}
              </Box>
              <CardContent>
                <Stack sx={{ alignItems: 'center' }}>
                  <Typography
                    sx={{ textAlign: 'center' }}
                    gutterBottom
                    variant="h5"
                    component="div"
                  >
                    {product?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Product OEM: {product?.oem}
                  </Typography>
                </Stack>
                <div
                  style={{
                    width: '100',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <AppButton
                    sx={{ py: 1, my: 3 }}
                    onClick={() => {
                      router.push(PRODUCT_LIST_URL);
                    }}
                    title="View All Products"
                  />
                </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography color="textPrimary" variant="h4" textAlign={'center'}>
              Product Mapping
            </Typography>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="body2"
              textAlign={'center'}
            >
              Product mapping here
            </Typography>
            <Dropdown
              name="mapping"
              label="Mapping With"
              handleChange={e => {
                setSelect(e.target.value);
              }}
              list={[
                { name: 'Vendor', id: 'Vendor' },
                { name: 'Customer', id: 'Customer' },
              ]}
            />
            {select == 'Vendor' ? (
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                onChange={(event, value) => setSelectedID(value?.id as string)}
                options={vendorData ?? []}
                isOptionEqualToValue={(option, value) =>
                  option.companyName === value.companyName
                }
                ListboxComponent={props => (
                  <div
                    {...props}
                    style={{ maxHeight: '200px', overflowY: 'auto' }}
                    onScroll={handleVendorScroll}
                  />
                )}
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Vendor"
                    onChange={e => {
                      setSearch(e.target.value);
                    }}
                  />
                )}
              />
            ) : null}
            {select == 'Customer' ? (
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                onChange={(event, value) =>
                  setSelectedID(value?.id as unknown as string)
                }
                options={customersData ?? []}
                isOptionEqualToValue={(option, value) =>
                  option.companyName === value.companyName
                }
                ListboxComponent={props => (
                  <div
                    {...props}
                    style={{ maxHeight: '200px', overflowY: 'auto' }}
                    onScroll={handleCustomerScroll}
                  />
                )}
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Customer"
                    onChange={e => {
                      setSearch(e.target.value);
                    }}
                  />
                )}
              />
            ) : null}
            <Input
              label="CODE"
              value={code}
              onChange={e => {
                setCode(e.target.value);
              }}
            />
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {select && (
                <>
                  {createMappingWithCustomer.isPending ||
                  createMappingWithVendor.isPending ? (
                    <CircularProgress />
                  ) : (
                    <AppButton
                      sx={{ py: 1, my: 1 }}
                      onClick={handleSubmit}
                      title="Save"
                    />
                  )}
                </>
              )}
            </div>
          </Grid>
          <Grid item xs={6}></Grid>
        </Grid>
      </Box>
    </Box>
  );
}
Page.getLayout = (page: JSX.Element) => (
  <Layout heading={'MAPPING'}>{page}</Layout>
);

export const getServerSideProps = async () => {
  return { props: {} };
};
