import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
} from '@mui/material';
import { AppButton, ImagePicker, Input } from 'components';
import DataNotFound from 'components/common/DataNotFound';
import { PRODUCT_FORM_SCHEMA } from 'config/schema-validators';
import { useFormik } from 'formik';
import { CreateProductInput, TProduct } from 'interface/product';
import { useRouter } from 'next/router';
import { memo, useEffect } from 'react';
import { PRODUCT_LIST_URL } from 'routes';

type Props = {
  handleSubmit: (values: CreateProductInput) => void;
  data: TProduct | undefined;
  loading?: boolean;
};
const Product = ({ handleSubmit, data, loading }: Props) => {
  const router = useRouter();

  if (router.query.pid != data?.id) {
    router.replace('/');
    return <DataNotFound title="Product" />;
  }

  const formik = useFormik<CreateProductInput>({
    initialValues: {
      name: '',
      oem: '',
      image: null,
    },
    validationSchema: PRODUCT_FORM_SCHEMA(),
    onSubmit: values => {
      handleSubmit(values);
    },
  });

  useEffect(() => {
    if (data) {
      formik.setFieldValue('name', data.name);
      formik.setFieldValue('oem', data.oem);
      formik.setFieldValue('image', data.image);
    }
  }, [data]);
  const handleFormikFileUpload = (files: File[]) => {
    formik.setFieldValue('image', files[0]);
  };
  const deleteImage = () => {
    formik.setFieldValue('image', null);
  };
  return (
    <form
      onSubmit={formik.handleSubmit}
      style={{ width: '100%', margin: '0rem 1rem' }}
    >
      <Card>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <KeyboardBackspaceIcon
              style={{
                fontSize: '40px',
                cursor: 'pointer',
                marginLeft: '20px',
              }}
              onClick={() => {
                router.push(PRODUCT_LIST_URL);
              }}
            />
            <CardHeader title={'Update Product'} />
          </div>

          {loading ? (
            <CircularProgress style={{ marginRight: '30px' }} />
          ) : (
            <AppButton
              sx={{ mx: 1, width: '60px', height: '40px', marginRight: '27px' }}
              type="submit"
              title={'SAVE'}
            />
          )}
        </div>

        <Divider style={{ borderColor: '#E6E8F0' }} />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <Input
                name="name"
                label={'Name'}
                value={formik.values.name}
                onChange={formik.handleChange}
                helperText={formik.touched.name && formik.errors.name}
                error={Boolean(formik.touched.name && formik.errors.name)}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Input
                name="oem"
                label={'OEM'}
                value={formik.values.oem}
                onChange={formik.handleChange}
                helperText={formik.touched.oem && formik.errors.oem}
                error={Boolean(formik.touched.oem && formik.errors.oem)}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <ImagePicker
                limit={1}
                getFiles={handleFormikFileUpload}
                deleteFile={deleteImage}
                ImagesUrls={formik.values.image ? [formik.values.image] : []}
              />
            </Grid>
            <Grid item md={6} xs={12}></Grid>
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
};

export const EditProduct = memo(Product);
