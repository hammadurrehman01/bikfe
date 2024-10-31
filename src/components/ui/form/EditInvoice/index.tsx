import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Skeleton,
  Stack,
  TextField,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { AppButton, List } from 'components';
import AddCustomerProductModal from 'components/common/AddCustomerProductCodeModal';
import DataNotFound from 'components/common/DataNotFound';
import { CustomizeDatePicker } from 'components/common/DatePicker';
import VendorProducts from 'components/ui/VendorProducts';
import CustomerProductHistory from 'components/ui/customer-product-history';
import { INVOICE_FORM_SCHEMA } from 'config/schema-validators';
import dayjs, { Dayjs } from 'dayjs';
import { useFormik } from 'formik';
import { currencies } from 'helpers/helper';
import NO_IMAGE from 'images/No_Image_.jpeg';
import { ErrorResponse } from 'interface/ApiError';
import { ICustomer } from 'interface/customer';
import {
  IInvoice,
  IUpdateInvoiceWithInvoiceItems,
  InvoiceItem,
} from 'interface/invoice';
import { TProduct, TProducts } from 'interface/product';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { memo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from 'redux/store';
import { INVOICE_LIST_URL } from 'routes';
import CustomerService from 'services/customer';
import InvoiceService from 'services/invoice';
import ProductService from 'services/product';
import { GetAssetFromS3ByKey } from 'services/storage.service';

type Props = {
  invoiceData: any;
};

export const UpdateInvoice = ({ invoiceData }: Props) => {
  const router = useRouter();

  if (router.query.pid != invoiceData?.id) {
    router.replace('/');
    return <DataNotFound title="Invoice" />;
  }

  const currencyOptions = currencies();
  const user = useSelector((state: RootState) => state.user);
  const [productID, setProductID] = useState<any>();
  const [dataExist, setDataExist] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [customerID, setCustomerID] = useState<ICustomer | undefined | null>({
    ...invoiceData?.customer,
    label: invoiceData?.customer?.companyName,
  });
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const [invoice, setInvoice] = useState<any>([]);
  const productService = new ProductService();
  const customerService = new CustomerService();
  const invoiceService = new InvoiceService();
  const queryClient = useQueryClient();
  const [customLoading, setCustomLoading] = useState(false);
  const [productSearch, setProductSearch] = useState('');

  useEffect(() => {
    async function getData() {
      formik.setFieldValue('customer', invoiceData?.customer.id);
      formik.setFieldValue('currency', invoiceData?.currency);
      formik.setFieldValue('date', invoiceData?.date);
      setCustomerID({
        ...invoiceData?.customer,
        label: invoiceData?.customer?.companyName,
      });

      const invoice = await Promise.all(
        invoiceData?.invoiceItem.map(
          async (item: {
            id: number;
            customerProduct: {
              product: { name: string; image: string };
              code: string;
              id: number;
            };
            quantity: number;
            price: number;
          }) => {
            let image = item?.customerProduct?.product.image as string;
            if (image) {
              image = await GetAssetFromS3ByKey(image);
            }

            return {
              id: item.id,
              image: image,
              product_name: item?.customerProduct?.product.name,
              code: item?.customerProduct?.code,
              customer_product_id: item?.customerProduct?.id,
              quantity: item.quantity,
              price: item.price,
            };
          },
        ),
      );
      setInvoice(invoice);
    }
    getData();
  }, [invoiceData]);

  const UpdateInvoice = useMutation({
    mutationFn: async (body: IUpdateInvoiceWithInvoiceItems) =>
      invoiceService.updateInvoice(body, invoiceData.id, user),
    onSuccess: () => {
      setIsLoading(true);
      toast.success('Invoice Updated Successfully');
      queryClient.invalidateQueries({ queryKey: ['GetInvoice'] });
      setIsLoading(false);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error?.response?.data?.error || 'Something Went Wrong');
    },
  });

  const formik = useFormik<IInvoice>({
    initialValues: {
      customerId: customerID && customerID.id ? customerID.id : '',
      currency: '',
      date: invoiceData.date || null,
      status: '',
    },
    validationSchema: INVOICE_FORM_SCHEMA(),
    onSubmit: async values => {
      const currenyCode = values.currency?.split('-')[0];

      const data = {
        invoiceData: {
          id: invoiceData.id,
          date: dayjs(values.date).format('DD-MM-YYYY'),
          status: values.status,
          customerId: Number(customerID?.id),
          currency: currenyCode,
        },
        invoiceItems: invoice.map((item: any) => {
          return {
            id: item.id,
            price: Number(item.price),
            quantity: item.quantity,
            customerProductId: item.customer_product_id,
          };
        }),
      };

      UpdateInvoice.mutate(data as IUpdateInvoiceWithInvoiceItems);
    },
  });

  const COLUMNS2 = [
    { dataField: 'code', caption: 'Code' },
    { dataField: 'product_name', caption: 'Product Name' },
    { dataField: 'quantity', caption: 'Quantity' },
    { dataField: 'price', caption: 'Price' },
  ];

  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [allProduct, setAllProducts] = useState<TProducts>([]);

  const { isLoading: productLoading } = useQuery({
    queryKey: ['searchProduct', page, productSearch],
    queryFn: async () => {
      const data = await productService.ListProduct(page, user, productSearch);
      if (data) {
        const products = data?.data?.data.products;
        if (productSearch) {
          setAllProducts(products);
          setHasNext(false);
        } else {
          setAllProducts(prev => [...prev, ...products]);
          setHasNext(data?.data?.data.hasNextPage);
        }
      }
      return data;
    },
    retry: 3,
    refetchOnWindowFocus: false,
  });

  const handleProductScroll = (event: any) => {
    const target = event.target as HTMLDivElement;
    const bottom =
      target.scrollHeight - target.scrollTop - target.clientHeight < 1;
    if (bottom && hasNext) {
      setPage((prevPage: number) => prevPage + 1);
    }
  };

  const productData: TProducts | undefined = allProduct?.map((itm, i) => {
    return { ...itm, label: itm.name };
  });

  const removeForm = () => {
    setProductSearch('');
    setProductID(null);
  };

  const GetMappingCode = useMutation({
    mutationFn: async (val: { customerid: number; productid: number }) => {
      const response = await customerService.GetCustomerMappingCode(
        val.customerid,
        val.productid,
        user,
      );
      if (response.data.data === null) {
        setDataExist(true);
      }

      return response;
    },
    onSuccess: async data => {
      const item = data.data.data;
      if (item) {
        const inv = invoice.find(itm => itm.customer_product_id === item.id);
        if (inv) {
          toast.error('You cannot add this product twice.');
        } else {
          let imageUrl = item.product.image;
          if (imageUrl) {
            imageUrl = await GetAssetFromS3ByKey(imageUrl);
          }
          setInvoice([
            ...invoice,
            {
              image: imageUrl ?? NO_IMAGE,
              code: item.code,
              product_name: item.product.name,
              customer_product_id: item.id,
              price: 0,
              quantity: 0,
            },
          ]);
        }
      } else {
        setOpen(true);
      }
      setCustomLoading(false);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      setCustomLoading(false);
      toast.error(error?.response?.data?.error);
    },
  });

  const addInvoice = async () => {
    if (productID) {
      setCustomLoading(true);
      GetMappingCode.mutate({
        customerid: Number(customerID?.id),
        productid: productID?.id,
      });
    } else {
      toast.error('Please Select All Fields');
    }
  };

  const handleClose = () => setOpen(false);

  const addItemtoInvoice = (item: InvoiceItem) => {
    setInvoice((invoice: any) => [...invoice, item]);
  };

  const handleChangeDate = (newValue: any) => {
    formik.setFieldValue('date', newValue);
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      style={{ width: '100%', margin: '0rem 1rem' }}
    >
      <Grid container spacing={3}>
        {dataExist && (
          <AddCustomerProductModal
            open={open}
            invoiceId={invoiceData.id}
            handleClose={handleClose}
            addItemtoInvoice={addItemtoInvoice}
            customerId={customerID && customerID.id ? customerID.id : -1}
            productId={productID && productID.id ? productID.id : -1}
            removeForm={removeForm}
          />
        )}
        <Grid item md={3} xs={12}>
          <Card sx={{ borderLeft: '4px solid gray' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '16px',
              }}
            >
              <KeyboardBackspaceIcon
                style={{
                  fontSize: '40px',
                  cursor: 'pointer',
                  marginLeft: '20px',
                  marginRight: '50px',
                }}
                onClick={() => {
                  router.push(INVOICE_LIST_URL);
                }}
              />
              Invoice
            </div>
            <CardContent>
              <Autocomplete
                sx={{ marginY: '20px' }}
                disablePortal
                disabled
                getOptionLabel={option => option.companyName || ''}
                id="combo-box-demo"
                value={customerID === null ? null : customerID}
                onChange={(event, value: any) => {
                  setCustomerID(value);
                  formik.setFieldValue('customerId', value?.id);
                }}
                options={[]}
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Customer Name"
                    value={search}
                    onChange={e => {
                      setSearch(e.target.value);
                    }}
                  />
                )}
              />
              {/* PRODUCT AUTOCOMPLETE */}
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={productData}
                sx={{ marginY: '20px' }}
                inputMode="search"
                inputValue={productID ? productID.label : productSearch}
                ListboxComponent={props => (
                  <div
                    {...props}
                    style={{ maxHeight: '200px', overflowY: 'auto' }}
                  />
                )}
                filterOptions={(options, { inputValue }) => {
                  return options.filter(
                    option =>
                      option.name
                        .toLowerCase()
                        .includes(inputValue.toLowerCase()) ||
                      option.oem
                        .toLowerCase()
                        .includes(inputValue.toLowerCase()),
                  );
                }}
                getOptionLabel={option => option.name}
                loading={productLoading}
                loadingText={
                  <Stack
                    sx={{ justifyContent: 'center', alignItems: 'center' }}
                  >
                    <CircularProgress sx={{ alignItems: 'center' }} size={20} />
                  </Stack>
                }
                noOptionsText={!productLoading ? 'No Options' : ''}
                onInputChange={(event, value) => {
                  setProductSearch(value);
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Product Name *"
                    onChange={e => {
                      setProductSearch(e.target.value);
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props} key={option.oem}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                      }}
                    >
                      <Box sx={{ width: '80px', mr: '10px' }}>
                        <Image
                          alt={'Product Image'}
                          src={option?.image || NO_IMAGE}
                          width={80}
                          height={80}
                          objectFit="contain"
                          layout="responsive"
                          style={{
                            width: '100%',
                            height: '100%',
                            maxWidth: '100%',
                            maxHeight: '100%',
                            padding: 10,
                          }}
                        />
                      </Box>
                      <Box
                        sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                      >
                        {`${option.name} (${option.oem})`}
                      </Box>
                    </Box>
                  </li>
                )}
                onChange={(event, value) => {
                  setProductID(value as TProduct);
                  formik.setFieldValue('productId', value?.id);
                }}
              />
              <Autocomplete
                disablePortal
                sx={{ marginTop: '20px' }}
                id="combo-box-demo"
                onChange={(event, value) => {
                  formik.setFieldValue('currency', value);
                }}
                value={formik.values.currency}
                options={currencyOptions ?? []}
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Currency"
                    value={formik.values.currency}
                  />
                )}
              />
              <CustomizeDatePicker
                sx={{ width: '100%', paddingBottom: '20px' }}
                value={formik.values.date}
                onChange={handleChangeDate}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '5px',
                }}
              >
                {customLoading ? (
                  <CircularProgress style={{ marginLeft: '30px' }} />
                ) : (
                  <AppButton
                    sx={{ mx: 1 }}
                    onClick={addInvoice}
                    title={'ADD'}
                  />
                )}
                {UpdateInvoice.isPending ? (
                  <CircularProgress style={{ marginLeft: '30px' }} />
                ) : customLoading ? null : (
                  <AppButton
                    type="submit"
                    sx={{ mx: 1 }}
                    title={'UPDATE'}
                    color={'success'}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item md={5} xs={12}>
          <VendorProducts productID={productID} />
        </Grid>
        <Grid item md={4} xs={12}>
          <CustomerProductHistory
            customerID={customerID as ICustomer}
            productID={productID}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item md={12} xs={12}>
          <CardContent sx={{ width: '100%', overflowX: 'auto' }}>
            {isLoading ? (
              <Skeleton
                sx={{
                  minWidth: '850px',
                  width: '100%',
                  margin: '0 auto',
                  height: '200px !important',
                }}
                variant="rounded"
                width={210}
                height={60}
              />
            ) : (
              <div style={{ minWidth: '800px', width: '100%' }}>
                <List
                  invoiceId={invoiceData.id}
                  imgCol={true}
                  columns={COLUMNS2}
                  content={invoice}
                  editable={true}
                />
              </div>
            )}
          </CardContent>
        </Grid>
      </Grid>
    </form>
  );
};
export const EditInvoice = memo(UpdateInvoice);
