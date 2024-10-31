import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { AppButton, Input, Layout, List } from 'components';
import TablesSkeleton from 'components/common/TableSkeleton';
import UpdateCustomerProductModal from 'components/common/updateCustomerProductCodeModal';
import { PaginationBar } from 'components/ui/paginationBar';
import VendorBillDetail from 'components/ui/vendorbilldetail';
import { useVendorProductData } from 'hooks/useVendorProductData';
import { ErrorResponse } from 'interface/ApiError';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from 'redux/store';
import { CUSTOMER_URL, VENDOR_LIST_URL, VENDOR_URL } from 'routes';
import { GetAssetFromS3ByKey } from 'services/storage.service';
import VendorService from 'services/vendor';

const COLUMNS = [
  { dataField: 'code', caption: 'Code' },
  { dataField: 'product', caption: 'Name' },
];

const CONTACT = [
  { dataField: 'number', caption: 'Number' },
  { dataField: 'contactPerson', caption: 'Contact person' },
];

const ADDRESS = [
  { dataField: 'address', caption: 'Address' },
  { dataField: 'country', caption: 'Country' },
];

export default function Page() {
  const [data, setData] = useState<any>();
  const [open, setOpen] = useState(false);
  const handleModal = () => setOpen(!open);

  const [product, setProduct] = useState<any>();
  const user = useSelector((state: RootState) => state.user);
  const [isSubmitting, setIsSubmitting] = useState(true);

  const router = useRouter();
  const pid = router.query.pid;
  const queryClient = useQueryClient();

  const vendorService = new VendorService();

  const { isLoading, isFetching } = useQuery({
    queryKey: ['GetVendor'],
    queryFn: async () => {
      try {
        const data = await vendorService.GetVendorById(pid, user);
        if (data) {
          setProduct(data?.data?.data);
          setIsSubmitting(false);
        }
        return data;
      } catch (error) {
        toast.error('Something Went Wrong');
        throw error; // Re-throw the error to ensure the query status reflects the failure
      }
    },
    retry: 3,
    refetchOnWindowFocus: false,
  });

  const [search, setSearch] = useState('');
  const {
    vendorProductData,
    isFetching: isVendorProductFetching,
    handleNext,
    handlePrevious,
    isPrevious,
    isNext,
  } = useVendorProductData(pid as string, search);

  const [resolvedImages, setResolvedImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      if (
        vendorProductData?.data?.data.vendorProducts &&
        Array.isArray(vendorProductData.data.data.vendorProducts)
      ) {
        const images = await Promise.all(
          vendorProductData.data.data.vendorProducts.map(async item => {
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
  }, [vendorProductData]);

  const productsData =
    vendorProductData &&
    vendorProductData.data.data.vendorProducts?.map((item, index) => {
      return {
        ...item,
        image: resolvedImages[index] || '',
        product: item.product.name,
      };
    });

  const deleteCustomerMutat = useMutation({
    mutationFn: async (deleteid: number | undefined | string) => {
      await vendorService.vendorProductDelete(deleteid, user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GetVendorProduct'] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error?.response?.data?.error || 'Something Went Wrong');
    },
  });

  const deleteFunction = (id: number | string) => {
    deleteCustomerMutat.mutate(id);
  };

  const renderUpdateCustomerProductModal = () => {
    return (
      <UpdateCustomerProductModal
        open={open}
        handleClose={handleModal}
        customerProductId={data?.id}
        isCustomer={false}
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
                router.push(VENDOR_LIST_URL);
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
                    <Input value={product?.companyName} disabled={true} />
                    <Typography>Email:</Typography>
                    <Input value={product?.email} disabled={true} />
                    <Typography>Website:</Typography>
                    <Input value={product?.website ?? ''} disabled={true} />
                  </>
                )}

                <AppButton
                  sx={{ marginTop: '40px' }}
                  title="Edit Vendor"
                  onClick={() => {
                    router.push(`${VENDOR_URL}/${product.id}`);
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
              Vendor Details
            </Typography>
            <Card sx={{ Width: '80%' }}>
              <CardContent style={{ textAlign: 'center' }}>
                <p style={{ fontWeight: 'bold', fontSize: '20px' }}>Contact</p>
                {isLoading ? (
                  <TablesSkeleton numberOfRows={2} />
                ) : (
                  <List
                    columns={CONTACT}
                    content={product?.vendorPhone}
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
                    content={product?.vendorAddress}
                    url={CUSTOMER_URL}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <VendorBillDetail id={pid as unknown as number} />
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
                Vendor Products
              </h2>
              <TextField
                placeholder="Name Or Code"
                onChange={e => {
                  setSearch(e.target.value);
                }}
                hiddenLabel
                id="filled-hidden-label-normal"
                variant="filled"
              />
            </div>
            {isVendorProductFetching ? (
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
                deleteFunction={deleteFunction}
              />
            )}
            {!!productsData?.length && !isVendorProductFetching && (
              <PaginationBar
                isNext={isNext}
                isPrevious={isPrevious}
                handlePrevious={handlePrevious}
                handleNext={handleNext}
              />
            )}
          </Grid>
          <Grid item xs={6}>
            {/* <MediaCard /> */}
          </Grid>
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
