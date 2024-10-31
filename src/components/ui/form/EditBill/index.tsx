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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ErrorResponse } from 'interface/ApiError';
import { AppButton, List } from 'components';
import AddVendorProductModal from 'components/common/AddVendorProductCodeModal';
import DataNotFound from 'components/common/DataNotFound';
import { CustomizeDatePicker } from 'components/common/DatePicker';
import { BILL_FORM_SCHEMA } from 'config/schema-validators';
import dayjs, { Dayjs } from 'dayjs';
import { useFormik } from 'formik';
import { currencies } from 'helpers/helper';
import { useProductData } from 'hooks/useProductData';
import NO_IMAGE from 'images/No_Image_.jpeg';
import { BillItem, IBill, IUpdateBillWithBillItems } from 'interface/bill';
import { TProduct, TProducts } from 'interface/product';
import { IVendor } from 'interface/vendor';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { memo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from 'redux/store';
import { BILL_LIST_URL } from 'routes';
import BillService from 'services/bill';
import ProductService from 'services/product';
import { GetAssetFromS3ByKey } from 'services/storage.service';
import VendorService from 'services/vendor';
import VendorProducts from 'components/ui/VendorProducts';
import VendorProductHistory from 'components/ui/vendor-product-history';

type Props = {
  billData: any;
};

export const UpdateBill = ({ billData }: Props) => {
  const router = useRouter();

  if (router.query.pid != billData?.id) {
    router.replace('/');
    return <DataNotFound title="Bill" />;
  }

  const currencyOptions = currencies();
  const user = useSelector((state: RootState) => state.user);
  const [productID, setProductID] = useState<any>();
  const [vendorID, setVendorID] = useState<IVendor | undefined | null>({
    ...billData?.vendor,
    label: billData?.vendor?.companyName,
  });
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [bill, setBill] = useState<any>([]);
  const vendorService = new VendorService();
  const billService = new BillService();
  const queryClient = useQueryClient();
  const [customLoading, setCustomLoading] = useState(false);
  const [isMappingExists, setIsMappingExists] = useState(false);
  const pid: string | string[] | undefined = router.query.pid;

  useEffect(() => {
    async function getData() {
      if (
        billData &&
        billData.billItem[0] &&
        billData.billItem[0].vendorProduct &&
        billData.billItem[0].vendorProduct.product
      ) {
        setProductID(billData.billItem[0].vendorProduct.product);
      }
      formik.setFieldValue('vendor', billData?.vendor.id);
      formik.setFieldValue('currency', billData?.currency);
      formik.setFieldValue('date', billData?.date);
      setVendorID({
        ...billData?.vendor,
        label: billData?.vendor?.companyName,
      });
      const bill = await Promise.all(
        billData?.billItem.map(
          async (item: {
            id: number;
            vendorProduct: {
              product: { name: string; image: string };
              code: string;
              id: number;
            };
            quantity: number;
            price: number;
          }) => {
            let image = item?.vendorProduct?.product?.image;
            if (image) {
              image = await GetAssetFromS3ByKey(image);
            }

            return {
              id: item.id,
              image: image,
              product_name: item?.vendorProduct?.product.name,
              code: item?.vendorProduct?.code,
              vendor_product_id: item?.vendorProduct?.id,
              quantity: item.quantity,
              price: item.price,
            };
          },
        ),
      );
      setBill(bill);
    }
    getData();
  }, [billData]);
  const [productSearch, setProductSearch] = useState('');

  const UpdateBill = useMutation({
    mutationFn: async (body: IUpdateBillWithBillItems) =>
      await billService.UpdateBill(body, pid, user),
    onSuccess: () => {
      toast.success('Bill Updated Successfully');
      queryClient.invalidateQueries({ queryKey: ['ListBill'] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error?.response?.data?.error || 'Something Went Wrong');
    },
  });

  const formik = useFormik<IBill>({
    initialValues: {
      vendorId: vendorID && vendorID.id ? vendorID.id : '',
      currency: '',
      date: billData.date || null,
      status: '',
    },
    validationSchema: BILL_FORM_SCHEMA(),
    onSubmit: async values => {
      const currenyCode = values.currency?.split('-')[0];

      const data = {
        billData: {
          id: billData.id,
          date: dayjs(values.date).format('DD-MM-YYYY'),
          status: values.status,
          vendorId: Number(vendorID?.id),
          currency: currenyCode,
        },
        billItems: bill.map((item: any) => {
          return {
            id: item.id,
            price: Number(item.price),
            quantity: item.quantity,
            vendorProductId: item.vendor_product_id,
          };
        }),
      };
      UpdateBill.mutate(data as any);
    },
  });

  const COLUMNS2 = [
    { dataField: 'code', caption: 'Code' },
    { dataField: 'product_name', caption: 'Product Name' },
    { dataField: 'quantity', caption: 'Quantity' },
    { dataField: 'price', caption: 'Price' },
  ];

  const [page] = useState(1);
  const [_hasNext, setHasNext] = useState(false);
  const [_allProduct, setAllProducts] = useState<TProducts>([]);

  const { isLoading: productLoading } = useQuery({
    queryKey: ['searchProduct', page, productSearch],
    queryFn: async () => {
      const productService = new ProductService();
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

  const { products, isProductLoading } = useProductData(productSearch, true);

  const productData: TProducts | undefined =
    products &&
    products?.map((itm, i) => {
      return { ...itm, label: itm.name };
    });

  const GetMappingCode = useMutation({
    mutationFn: async (val: {
      vendorid: number | string;
      productid: number | string;
    }) => {
      const response = await vendorService.GetVendorMappingCode(
        val.vendorid,
        val.productid,
        user,
      );

      if (response.data.data === null) {
        setOpen(true);
        setCustomLoading(false);
        setIsMappingExists(false);
      } else {
        setIsMappingExists(true);
        const imageUrl = await GetAssetFromS3ByKey(
          response.data.data.vendorProduct?.image,
        );
        setBill([
          ...bill,
          {
            id: response.data.data.id,
            image: imageUrl,
            code: response.data.data.vendorProduct.code,
            product_name: response.data.data.vendorProduct.product.name,
            vendor_product_id: response.data.data.vendorProduct.id,
            price: 0,
            quantity: 0,
          },
        ]);
      }
    },
    onError: (error: any) => {
      setCustomLoading(false);
      if (error?.response?.status === 404) {
        setOpen(true);
        return;
      }
      toast.error('This Product is already mapped');
    },
  });

  const addToBill = async () => {
    if (productID) {
      setCustomLoading(true);
      GetMappingCode.mutate({
        vendorid: Number(vendorID?.id),
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
  const removeForm = () => {
    setProductSearch('');
    setProductID(null);
  };

  const handleClose = () => setOpen(false);

  const addItemtoBill = (item: BillItem) => {
    setBill((bill: any) => [...bill, item]);
  };

  const handleChangeDate = (newValue: any) => {
    formik.setFieldValue('date', newValue?.format('DD-MM-YYYY'));
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      style={{ width: '100%', margin: '0rem 1rem' }}
    >
      <Grid container spacing={3}>
        {!isMappingExists && (
          <AddVendorProductModal
            open={open}
            handleClose={handleClose}
            addItemtoBill={addItemtoBill}
            removeForm={removeForm}
            billId={billData.id}
            vendorId={vendorID && vendorID.id ? Number(vendorID.id) : -1}
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
              <Autocomplete
                sx={{ marginY: '20px' }}
                disablePortal
                disabled
                getOptionLabel={option => option.companyName || ''}
                id="combo-box-demo"
                value={vendorID === null ? null : vendorID}
                onChange={(event, value: any) => {
                  setVendorID(value);
                  formik.setFieldValue('vendor', value?.id);
                }}
                options={[]}
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Vendor Name"
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
                isOptionEqualToValue={(option, value) =>
                  option.name === value.name
                }
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
                  formik.setFieldValue('currency', value ?? '');
                }}
                value={formik.values.currency}
                options={currencyOptions}
                isOptionEqualToValue={(option, value) => option === value}
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
                  marginTop: '15px',
                }}
              >
                {customLoading ? (
                  <CircularProgress style={{ marginLeft: '30px' }} />
                ) : (
                  <AppButton sx={{ mx: 1 }} onClick={addToBill} title={'ADD'} />
                )}
                {UpdateBill.isPending ? (
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
          {/* TODO update and delete */}
          <VendorProducts productID={productID} />
        </Grid>
        <Grid item md={4} xs={12}>
          <VendorProductHistory
            vendorID={vendorID as IVendor}
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
                editable={true}
                billId={billData.id}
              />
            </div>
          </CardContent>
        </Grid>
      </Grid>
    </form>
  );
};
export const EditBill = memo(UpdateBill);
