import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  TextField,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { AppButton, List } from 'components';
import AddCustomerProductModal from 'components/common/AddCustomerProductCodeModal';
import { CustomizeDatePicker } from 'components/common/DatePicker';
import VendorProducts from 'components/ui/VendorProducts';
import CustomerProductHistory from 'components/ui/customer-product-history';
import { INVOICE_FORM_SCHEMA } from 'config/schema-validators';
import { Dayjs } from 'dayjs';
import { useFormik } from 'formik';
import { currencies } from 'helpers/helper';
import { useCustomerData } from 'hooks/useCustomerData';
import { useProductData } from 'hooks/useProductData';
import NO_IMAGE from 'images/No_Image_.jpeg';
import { ErrorResponse } from 'interface/ApiError';
import { ICustomer, ICustomers } from 'interface/customer';
import {
  IInvoice,
  IInvoiceWithInvoiceItems,
  InvoiceItem,
} from 'interface/invoice';
import { TProduct, TProducts } from 'interface/product';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from 'redux/store';
import { INVOICE_LIST_URL } from 'routes';
import CustomerService from 'services/customer';
import InvoiceService from 'services/invoice';
import { GetAssetFromS3ByKey } from 'services/storage.service';

export const AddInvoice = () => {
  const user = useSelector((state: RootState) => state.user);
  const [productID, setProductID] = useState<TProduct | null>();
  const [customerID, setCustomerID] = useState<ICustomer | undefined>();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<Dayjs | null>(null);
  const [invoice, setInvoice] = useState<InvoiceItem[]>([]);
  const router = useRouter();
  const customerService = new CustomerService();
  const invoiceService = new InvoiceService();
  const queryClient = useQueryClient();
  const [customLoading, setCustomLoading] = useState(false);
  const [dataExist, setDataExist] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');

  const currencyOptions = currencies();

  const CreateInvoice = useMutation({
    mutationFn: async (body: IInvoiceWithInvoiceItems) =>
      await invoiceService.CreateInvoice(body, user),
    onSuccess: () => {
      toast.success('Invoice Added Successfully');
      queryClient.invalidateQueries({ queryKey: ['ListInvoice'] });
      setInvoice([]);
      router.push('/invoice/list');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error?.response?.data?.error || 'Something went wrong');
    },
  });

  const formik = useFormik<IInvoice>({
    initialValues: {
      customerId: customerID && customerID.id ? customerID.id : '',
      currency: '',
      date: '',
      status: '',
    },
    validationSchema: INVOICE_FORM_SCHEMA(),
    onSubmit: async values => {
      const currenyCode = values.currency?.split('-')[0];

      const data = {
        invoiceData: {
          date: values.date,
          status: values.status,
          customerId: customerID?.id,
          currency: currenyCode,
        },
        invoiceItems: invoice.map(item => {
          return {
            price: Number(item.price),
            quantity: item.quantity,
            customerProductId: item.customer_product_id,
          };
        }),
      };

      if (!data.invoiceData.date) {
        toast.error('Enter the Date');
        return;
      }
      if (!data.invoiceData.currency) {
        toast.error('Select the Currency');
        return;
      }

      CreateInvoice.mutate(data as any);
    },
  });
  const COLUMNS2 = [
    { dataField: 'code', caption: 'Code' },
    { dataField: 'product_name', caption: 'Product Name' },
    { dataField: 'quantity', caption: 'Quantity' },
    { dataField: 'price', caption: 'Price' },
  ];

  const {
    customers,
    handleScroll: handleCustomerScroll,
    isCustomerLoading,
  } = useCustomerData(customerSearch, true);

  const customerData: ICustomers | undefined =
    customers &&
    customers?.map((itm, i) => {
      return { ...itm, label: itm.companyName };
    });

  const { products, isProductLoading } = useProductData(productSearch, true);

  const productData: TProducts | undefined =
    products &&
    products?.map((itm, i) => {
      return { ...itm, label: itm.name };
    });

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

  const removeForm = () => {
    setProductSearch('');
    setProductID(null);
  };

  const addInvoiceToList = async () => {
    if (productID?.id && customerID?.id) {
      setCustomLoading(true);
      await GetMappingCode.mutate({
        customerid: customerID?.id,
        productid: productID?.id,
      });
    } else {
      if (!customerID?.id) {
        toast.error('Select the Customer Name from List');
        return;
      }
      if (!productID?.id) {
        toast.error('Select the Product Name from List');
        return;
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    removeForm();
  };

  const addItemtoInvoice = (item: InvoiceItem) => {
    setInvoice(invoice => [...invoice, item]);
  };

  const handleChangeDate = (newValue: any) => {
    setValue(newValue);
    formik.setFieldValue('date', newValue.format('DD-MM-YYYY'));
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
            handleClose={handleClose}
            addItemtoInvoice={addItemtoInvoice}
            removeForm={removeForm}
            customerId={customerID && customerID.id ? customerID.id : -1}
            productId={productID && productID.id ? productID.id : -1}
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
              {/* CUSTOMER AUTOCOMPLETE */}
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                value={customerID}
                onChange={(event, value) => {
                  setCustomerID(value as ICustomer);
                  formik.setFieldValue('customerId', value?.id);
                }}
                options={customerData ?? []}
                ListboxComponent={props => (
                  <div
                    {...props}
                    style={{ maxHeight: '200px', overflowY: 'auto' }}
                    onScroll={handleCustomerScroll}
                  />
                )}
                loading={isCustomerLoading}
                loadingText={
                  <Stack
                    sx={{ justifyContent: 'center', alignItems: 'center' }}
                  >
                    <CircularProgress sx={{ alignItems: 'center' }} size={20} />
                  </Stack>
                }
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Customer Name *"
                    value={customerSearch}
                    onChange={e => {
                      setCustomerSearch(e.target.value);
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
                loading={isProductLoading}
                loadingText={
                  <Stack
                    sx={{ justifyContent: 'center', alignItems: 'center' }}
                  >
                    <CircularProgress sx={{ alignItems: 'center' }} size={20} />
                  </Stack>
                }
                noOptionsText={!isProductLoading ? 'No Options' : ''}
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
                      <Box
                        sx={{
                          width: '80px',
                          height: '80px',
                          mr: '10px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          overflow: 'hidden',
                        }}
                      >
                        <Image
                          alt={'Product Image'}
                          src={option?.image || NO_IMAGE}
                          width={80}
                          height={80}
                          objectFit="contain"
                          style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                          }}
                        />
                      </Box>
                      <Box
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
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

              {/* CURRENCY AUTOCOMPLETE */}
              <Autocomplete
                disablePortal
                sx={{ marginTop: '20px' }}
                id="combo-box-demo"
                onChange={(event, value) => {
                  formik.setFieldValue('currency', value);
                }}
                options={currencyOptions ?? []}
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Currency *"
                    value={formik.values.currency}
                  />
                )}
              />
              <CustomizeDatePicker
                sx={{ width: '100%', paddingBottom: '20px' }}
                value={value}
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
                    onClick={addInvoiceToList}
                    title={'ADD'}
                  />
                )}
                {CreateInvoice.isPending ? (
                  <CircularProgress style={{ marginLeft: '30px' }} />
                ) : customLoading ? null : (
                  <AppButton
                    type="submit"
                    sx={{ mx: 1 }}
                    title={'CREATE'}
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
            customerID={customerID}
            productID={productID}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item md={12} xs={12}>
          <CardContent sx={{ width: '100%', overflowX: 'auto' }}>
            <div style={{ minWidth: '800px', width: '100%' }}>
              <List
                columns={COLUMNS2}
                imgCol={true}
                content={invoice}
                editable={false}
              />
            </div>
          </CardContent>
        </Grid>
      </Grid>
    </form>
  );
};
