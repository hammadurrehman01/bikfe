import { CircularProgress, Grid } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AppButton, Input } from 'components';
import { UPDATE_CUSTOMER_PRODUCT_CODE_SCHEMA } from 'config/schema-validators';
import { useFormik } from 'formik';
import { IUpdateCustomerMapping } from 'interface/customer';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from 'redux/store';
import CustomerService from 'services/customer';
import { AppModal } from '../Modal';
import { AxiosError } from 'axios';
import { ErrorResponse } from 'interface/ApiError';

type prop = {
  open: boolean;
  handleClose: () => void;
  customerProductId: number;
  isCustomer: boolean;
};

export default function UpdateCustomerProductModal({
  open,
  handleClose,
  customerProductId,
  isCustomer = false,
}: prop) {
  const queryClient = useQueryClient();
  const customerService = new CustomerService();
  const router = useRouter();
  const pid: string | string[] | undefined = router.query.pid;

  const user = useSelector((state: RootState) => state.user);
  const formik = useFormik({
    initialValues: {
      code: '',
      customerProductId: customerProductId,
    },
    validationSchema: UPDATE_CUSTOMER_PRODUCT_CODE_SCHEMA(),
    enableReinitialize: true,
    onSubmit: values => {
      if (isCustomer) {
        updateCustomerProduct.mutate(values);
      } else {
        // updateVendorProduct.mutate(values);
      }
    },
  });

  const updateCustomerProduct = useMutation({
    mutationFn: async (body: IUpdateCustomerMapping) =>
      await customerService.UpdateCustomerProduct(
        user,
        body.customerProductId,
        body.code,
        pid,
      ),
    onSuccess: async data => {
      if (data.data.data) {
        queryClient.invalidateQueries({ queryKey: ['ListCustomerProducts'] });
        toast.success('Customer Product updated Successfully');
        handleClose();
      }
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error?.response?.data?.error || 'Something Went Wrong');
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
          <h3>Enter a number to update product code</h3>
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
              {updateCustomerProduct.isPending ? (
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
