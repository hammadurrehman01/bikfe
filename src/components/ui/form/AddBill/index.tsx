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
import AddVendorProductModal from 'components/common/AddVendorProductCodeModal';
import { CustomizeDatePicker } from 'components/common/DatePicker';
import VendorProducts from 'components/ui/VendorProducts';
import VendorProductHistory from 'components/ui/vendor-product-history';
import { BILL_FORM_SCHEMA } from 'config/schema-validators';
import { Dayjs } from 'dayjs';
import { useFormik } from 'formik';
import { currencies } from 'helpers/helper';
import { useProductData } from 'hooks/useProductData';
import { useVendorData } from 'hooks/useVendorData';
import NO_IMAGE from 'images/No_Image_.jpeg';
import { ErrorResponse } from 'interface/ApiError';
import { BillItem, IBill, IBillWithBillItems } from 'interface/bill';
import { TProduct, TProducts } from 'interface/product';
import { IListVendor } from 'interface/vendor';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from 'redux/store';
import { BILL_LIST_URL } from 'routes';
import BillService from 'services/bill';
import { GetAssetFromS3ByKey } from 'services/storage.service';
import VendorService from 'services/vendor';

export const AddBill = () => {
  const currencyOptions = currencies();
  const user = useSelector((state: RootState) => state.user);
  const [productID, setProductID] = useState<TProduct | null>();
  const [vendorID, setVendorID] = useState<IListVendor | null>();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<Dayjs | null>(null);
  const [bill, setBill] = useState<BillItem[]>([]);
  const router = useRouter();
  const vendorService = new VendorService();
  const billService = new BillService();
  const queryClient = useQueryClient();
  const [customLoading, setCustomLoading] = useState(false);
  const [dataExist, setDataExist] = useState(false);

  const CreateBill = useMutation({
    mutationFn: async (body: IBillWithBillItems) =>
      await billService.CreateBill(body, user),
    onSuccess: () => {
      toast.success('Bill Added Successfully');
      queryClient.invalidateQueries({ queryKey: ['ListBill'] });
      setBill([]);
      router.push('/bill/list');
    },
    onError: () => {
      toast.error('Failed to Create Bill');
    },
  });

  const formik = useFormik<IBill>({
    initialValues: {
      vendorId: '',
      currency: '',
      date: '',
      status: '',
    },
    validationSchema: BILL_FORM_SCHEMA(),
    onSubmit: async values => {
      const currenyCode = values.currency?.split('-')[0];

      const data: any = {
        billData: {
          date: values.date,
          status: values.status,
          vendorId: vendorID?.id,
          currency: currenyCode,
        },
        billItems: bill.map(item => {
          return {
            price: Number(item.price),
            quantity: item.quantity,
            vendorProductId: item.vendor_product_id,
          };
        }),
      };

      if (!data.billData.date) {
        toast.error('Enter the Date');
        return;
      }
      if (!data.billData.currency) {
        toast.error('Select the Currency');
        return;
      }

      CreateBill.mutate(data);
    },
  });

  const COLUMNS2 = [
    { dataField: 'code', caption: 'Code' },
    { dataField: 'product_name', caption: 'Product Name' },
    { dataField: 'quantity', caption: 'Quantity' },
    { dataField: 'price', caption: 'Price' },
  ];

  const [vendorSearch, setVendorSearch] = useState('');
  const { vendors, handleVendorScroll, isVendorLoading } = useVendorData(
    vendorSearch,
    true,
  );

  const vendorData: IListVendor[] | undefined = vendors?.map((itm, i) => {
    return { ...itm, label: itm.companyName };
  });

  const [productSearch, setProductSearch] = useState('');
  const { products, isProductLoading } = useProductData(productSearch, true);

  const productData: TProducts | undefined =
    products &&
    products?.map((itm, i) => {
      return { ...itm, label: itm.name };
    });

  const GetMappingCode = useMutation({
    mutationFn: async (val: {
      vendorid: string | number;
      productid: string | number;
    }) => {
      const response = await vendorService.GetVendorMappingCode(
        val.vendorid,
        val.productid,
        user,
      );
      if (response.data.data === null) {
        setDataExist(false);
      }
      return response;
    },
    onSuccess: async data => {
      const item = data.data.data;

      if (item) {
        const billExists = bill.find(itm => itm.vendor_product_id === item.id);
        if (billExists) {
          toast.error('You cannot add this product twice.');
        } else {
          let imageUrl = item.product.image;
          if (imageUrl) {
            imageUrl = await GetAssetFromS3ByKey(imageUrl);
          }
          setBill([
            ...bill,
            {
              image: imageUrl ?? NO_IMAGE,
              code: item.code,
              product_name: item.product.name,
              vendor_product_id: item.id,
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

  const addToBill = async () => {
    if (productID?.id && vendorID?.id) {
      setCustomLoading(true);
      GetMappingCode.mutate({
        vendorid: vendorID?.id,
        productid: productID?.id,
      });
    } else {
      if (!vendorID?.id) {
        toast.error('Select the Vendor Name from List');
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

  const addItemtoBill = (item: BillItem) => {
    setBill(bill => [...bill, item]);
  };

  const handleChangeDate = (newValue: any) => {
    setValue(newValue);
    formik.setFieldValue('date', newValue?.format('DD-MM-YYYY'));
  };

  const productAutocompleteData = productData;

  return (
    <form
      onSubmit={formik.handleSubmit}
      style={{ width: '100%', margin: '0rem 1rem' }}
    >
      <Grid container spacing={3}>
        {!dataExist && (
          <AddVendorProductModal
            open={open}
            removeForm={removeForm}
            handleClose={handleClose}
            addItemtoBill={addItemtoBill}
            vendorId={vendorID && vendorID.id ? vendorID.id : -1}
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
                  router.push(BILL_LIST_URL);
                }}
              />
              Bill
            </div>
            <CardContent>
              {/* VENDOR AUTOCOMPLETE */}
              <Autocomplete
                sx={{ marginY: '20px' }}
                disablePortal
                id="combo-box-demo"
                value={vendorID}
                options={vendorData ?? []}
                onChange={(event, value) => {
                  setVendorID(value as IListVendor);
                  formik.setFieldValue('vendorId', value?.id);
                }}
                ListboxComponent={props => (
                  <div
                    {...props}
                    style={{ maxHeight: '200px', overflowY: 'auto' }}
                    onScroll={handleVendorScroll}
                  />
                )}
                loading={isVendorLoading}
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
                    label="Vendor Name *"
                    value={vendorSearch}
                    onChange={e => {
                      setVendorSearch(e.target.value);
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
                  marginTop: '15px',
                }}
              >
                {customLoading ? (
                  <CircularProgress style={{ marginLeft: '30px' }} />
                ) : (
                  <AppButton sx={{ mx: 1 }} onClick={addToBill} title={'ADD'} />
                )}
                {CreateBill.isPending ? (
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
          <VendorProductHistory
            vendorID={vendorID as any}
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
                content={bill}
                editable={false}
              />
            </div>
          </CardContent>
        </Grid>
      </Grid>
    </form>
  );
};
