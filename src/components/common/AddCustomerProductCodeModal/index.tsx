import { CircularProgress, Grid } from '@mui/material';
import { AppButton, Input } from 'components';
import { ADD_CUSTOMER_PRODUCT_CODE_SCHEMA } from 'config/schema-validators';
import { useFormik } from 'formik';
import { ICustomerMapping } from 'interface/customer';
import { InvoiceItem } from 'interface/invoice';
import { useMutation } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from 'redux/store';
import CustomerService from 'services/customer';
import { AppModal } from '../Modal';
import { GetAssetFromS3ByKey } from 'services/storage.service';

type prop = {
  open: boolean;
  handleClose: () => void;
  addItemtoInvoice: (item: InvoiceItem) => void;
  customerId: number;
  productId: number;
  invoiceId?: number;
  removeForm: () => void;
};

export default function AddCustomerProductModal({
  open,
  handleClose,
  addItemtoInvoice,
  customerId,
  productId,
  invoiceId,
  removeForm,
}: prop) {
  const customerService = new CustomerService();
  const user = useSelector((state: RootState) => state.user);
  const formik = useFormik({
    initialValues: {
      code: '',
      invoiceId,
      customerId,
      productId,
    },
    validationSchema: ADD_CUSTOMER_PRODUCT_CODE_SCHEMA(),
    enableReinitialize: true,
    onSubmit: values => {
      createCustomerProduct.mutate(values);
    },
  });

  const createCustomerProduct = useMutation({
    mutationFn: async (body: ICustomerMapping) =>
      await customerService.CreateCustomerMapping(customerId, body, user),
    onSuccess: async data => {
      if (data.data.data) {
        const item = data.data.data;

        const invoiceItem = item.invoiceItem.map(({ id }) => id);
        const invoiceItemId = invoiceItem[0];

        let image = item.product.image;
        if (image) {
          image = await GetAssetFromS3ByKey(item.product.image);
        }
        addItemtoInvoice({
          id: invoiceItemId,
          image: image,
          customer_product_id: item.id,
          code: item.code,
          product_name: item.product.name,
          price: 0,
          quantity: 0,
        });
        toast.success('Customer Product Created Successfully');
        handleClose();
        removeForm();
      }
    },
    onError: () => {
      toast.error('Failed to Create Customer Product Mapping');
    },
  });

  return (
    <AppModal open={open} onClose={handleClose}>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: '500px',
          minWidth: '300px',
          display: 'block',
          overflow: 'auto',
          backgroundColor: 'white',
        }}
      >
        <form onSubmit={formik.handleSubmit} style={{ margin: '40px' }}>
          <h3>Enter a code to create customer product</h3>
          <Grid container justifyContent={'center'}>
            <Grid item xs={8}>
              <Input
                name="code"
                label={'Code'}
                value={formik.values.code}
                onChange={formik.handleChange}
                helperText={formik.touched.code && formik.errors.code}
                error={Boolean(formik.touched.code && formik.errors.code)}
              />
            </Grid>
          </Grid>
          <Grid container justifyContent={'center'}>
            <Grid item xs={2}>
              {createCustomerProduct.isPending ? (
                <CircularProgress style={{ marginLeft: '30px' }} />
              ) : (
                <AppButton type="submit" title={'SAVE'} />
              )}
            </Grid>
          </Grid>
        </form>
      </div>
    </AppModal>
  );
}
