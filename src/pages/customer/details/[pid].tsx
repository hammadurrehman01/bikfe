import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { AppButton, Input, Layout, List } from 'components';
import TablesSkeleton from 'components/common/TableSkeleton';
import UpdateCustomerProductModal from 'components/common/updateCustomerProductCodeModal';
import CustomerInvoiceDetail from 'components/ui/customerinvoicedetail';
import { PaginationBar } from 'components/ui/paginationBar';
import { useCustomerProductData } from 'hooks/useCustomerProductData';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from 'redux/store';
import { CUSTOMER_LIST_URL, CUSTOMER_URL } from 'routes';
import CustomerService from 'services/customer';
import { GetAssetFromS3ByKey } from 'services/storage.service';

const COLUMNS = [
  { dataField: 'code', caption: 'Code' },
  { dataField: 'product', caption: 'Name' },
];
const CONTACT = [
  { dataField: 'number', caption: 'Number' },
  { dataField: 'contactPerson', caption: 'Contact Person' },
];
const ADDRESS = [
  { dataField: 'address', caption: 'Address' },
  { dataField: 'country', caption: 'Country' },
];
export default function Page() {
  const [customer, setCustomer] = useState<any>();
  const [data, setData] = useState<any>();
  const [open, setOpen] = useState(false);
  const handleModal = () => setOpen(!open);

  const user = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const pid = router.query.pid;

  const customerService = new CustomerService();

  const {
    data: customerData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['GetCustomer'],
    queryFn: async () => await customerService.GetCustomer(pid, user),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (customerData) {
      if (customerData?.data) {
        setCustomer(customerData?.data?.data);
      }
    }
  }, [customerData]);

  if (isError) {
    toast.error('Something Went Wrong');
  }

  const [search, setSearch] = useState('');
  const {
    handleNext,
    handlePrevious,
    isPrevious,
    isFetching: isCustomerProductFetching,
    isNext,
    customerProductData,
  } = useCustomerProductData(pid as string, search);

  const [resolvedImages, setResolvedImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      if (
        customerProductData?.data?.data?.customerProducts &&
        Array.isArray(customerProductData.data.data.customerProducts)
      ) {
        const images = await Promise.all(
          customerProductData.data.data.customerProducts.map(async item => {
            let fileUrl = item.product.image as string;
            if (fileUrl) {
              fileUrl = await GetAssetFromS3ByKey(fileUrl);
            }
            return fileUrl;
          }),
        );

        const desiredImages: string[] = images.filter(val => val !== null);

        setResolvedImages(desiredImages);
      }
    };

    fetchImages();
  }, [customerProductData]);

  const productsData =
    customerProductData &&
    customerProductData?.data?.data?.customerProducts?.map((item, index) => {
      return {
        ...item,
        image: resolvedImages[index] || '',
        product: item.product.name,
      };
    });

  const renderUpdateCustomerProductModal = () => {
    return (
      <UpdateCustomerProductModal
        open={open}
        handleClose={handleModal}
        customerProductId={data?.id}
        isCustomer={true}
      />
    );
  };

  return (
    <Box>
      <Box sx={{ my: 3, width: '90%', margin: 'auto', paddingTop: '50px' }}>
        <Grid container spacing={2}>
          {renderUpdateCustomerProductModal()}
          <Grid item xs={12} md={4}>
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
            <Card sx={{ Width: '80%', marginTop: '24px' }}>
              <CardContent style={{ textAlign: 'center' }}>
                <p
                  style={{
                    fontWeight: 'bold',
                    fontSize: '20px',
                    marginBottom: '20px',
                  }}
                >
                  Details
                </p>
                {isLoading ? (
                  <TablesSkeleton numberOfRows={1} />
                ) : (
                  <>
                    <Typography>Company Name:</Typography>
                    <Input
                      value={customer?.companyName ?? ''}
                      disabled={true}
                    />
                    <Typography>Email:</Typography>
                    <Input value={customer?.email ?? ''} disabled={true} />

                    <Typography>Website:</Typography>
                    <Input value={customer?.website ?? ''} disabled={true} />
                    <div style={{ marginBottom: '40px' }}></div>
                  </>
                )}
                <AppButton
                  title="Edit Customer"
                  onClick={() => {
                    router.push(`${CUSTOMER_URL}/${customer?.id}`);
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography
              color="textPrimary"
              variant="h4"
              textAlign={'center'}
              sx={{ marginTop: '5px', marginBottom: '20px' }}
            >
              Customer Details
            </Typography>
            <Card sx={{ Width: '80%' }}>
              <CardContent style={{ textAlign: 'center' }}>
                <p style={{ fontWeight: 'bold', fontSize: '20px' }}>Contact</p>
                {isLoading ? (
                  <TablesSkeleton numberOfRows={2} />
                ) : (
                  <List
                    columns={CONTACT}
                    content={customer?.customerPhone}
                    url={CUSTOMER_URL}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ Width: '80%', marginTop: '70px' }}>
              <CardContent style={{ textAlign: 'center' }}>
                <p style={{ fontWeight: 'bold', fontSize: '20px' }}>Address</p>
                {isLoading ? (
                  <TablesSkeleton numberOfRows={2} />
                ) : (
                  <List
                    columns={ADDRESS}
                    content={customer?.customerAddress}
                    url={CUSTOMER_URL}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomerInvoiceDetail id={pid as unknown as number} />
          </Grid>
          <Grid item xs={12} md={8}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginBottom: '20px',
              }}
            >
              <h2 style={{ fontWeight: 700, fontSize: '2rem' }}>
                Customer Products
              </h2>
              <TextField
                placeholder="Name or Code"
                onChange={e => {
                  setSearch(e.target.value);
                }}
                hiddenLabel
                id="filled-hidden-label-normal"
                variant="filled"
              />
            </div>
            {isCustomerProductFetching ? (
              <TablesSkeleton numberOfRows={4} />
            ) : (
              <List
                columns={COLUMNS}
                content={productsData}
                imgCol={true}
                editCol={true}
                isModal={true}
                handleModal={handleModal}
                setData={setData}
              />
            )}
            {!!productsData?.length && !isCustomerProductFetching && (
              <PaginationBar
                isNext={isNext}
                isPrevious={isPrevious}
                handlePrevious={handlePrevious}
                handleNext={handleNext}
              />
            )}
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
