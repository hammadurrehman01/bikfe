import { CircularProgress, Grid } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AppButton, Input } from 'components';
import { ADD_VENDOR_PRODUCT_CODE_SCHEMA } from 'config/schema-validators';
import { useFormik } from 'formik';
import { BillItem } from 'interface/bill';
import { IVendorMapping } from 'interface/vendor';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from 'redux/store';
import { GetAssetFromS3ByKey } from 'services/storage.service';
import VendorService from 'services/vendor';
import { AppModal } from '../Modal';
import { AxiosError } from 'axios';
import { ErrorResponse } from 'interface/ApiError';

type prop = {
  open: boolean;
  handleClose: () => void;
  addItemtoBill: (item: BillItem) => void;
  vendorId: string | number;
  productId: string | number;
  billId?: number;
  removeForm: () => void;
};

export default function AddVendorProductModal({
  open,
  handleClose,
  addItemtoBill,
  vendorId,
  productId,
  billId,
  removeForm,
}: prop) {
  const vendorService = new VendorService();
  const queryClient = useQueryClient();
  const user = useSelector((state: RootState) => state.user);
  const formik = useFormik({
    initialValues: {
      code: '',
      billId,
      vendorId,
      productId,
    },
    validationSchema: ADD_VENDOR_PRODUCT_CODE_SCHEMA(),
    enableReinitialize: true,
    onSubmit: values => {
      createVendorProduct.mutate(values);
    },
  });

  const createVendorProduct = useMutation({
    mutationFn: async (body: IVendorMapping) =>
      await vendorService.CreateVendorMapping(vendorId, body, user),
    onSuccess: async data => {
      if (data.data.data) {
        const item = data.data.data;

        const billItem = item.billItem.map(({ id }) => id);
        const billItemId = billItem[0];

        let image = item.product.image;
        if (image) {
          image = await GetAssetFromS3ByKey(item.product.image);
        }
        addItemtoBill({
          id: billItemId,
          image: image,
          vendor_product_id: item.id,
          code: item.code,
          product_name: item.product.name,
          price: 0,
          quantity: 0,
        });
        toast.success('Vendor Product Created Successfully');
        queryClient.invalidateQueries({ queryKey: ['searchProduct'] });
        handleClose();
        removeForm();
      }
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error?.response?.data?.error);
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
          <h3>Enter a code to create vendor product</h3>
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
              {createVendorProduct.isPending ? (
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
