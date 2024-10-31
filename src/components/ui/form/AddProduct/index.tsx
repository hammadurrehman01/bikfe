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
import { PRODUCT_FORM_SCHEMA } from 'config/schema-validators';
import { useFormik } from 'formik';
import { IProductInput } from 'interface/product';
import { useRouter } from 'next/router';
import { memo, useState } from 'react';
import { PRODUCT_LIST_URL } from 'routes';
type Props = {
  handleSubmit: (data: IProductInput) => Promise<void>;
  loading?: boolean;
};
const Product = ({ handleSubmit, loading }: Props) => {
  const [clearFile, setFile] = useState(false);
  const formik = useFormik<IProductInput>({
    initialValues: {
      name: '',
      oem: '',
      image: null,
    },
    validationSchema: PRODUCT_FORM_SCHEMA(),
    onSubmit: async values => {
      handleSubmit(values);
      formik.setFieldValue('name', '');
      formik.setFieldValue('oem', '');
      formik.setFieldValue('image', null);
      setFile(true);
    },
  });

  const router = useRouter();

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
            <CardHeader title={'Add Product'} />
          </div>
          {loading ? (
            <CircularProgress style={{ marginRight: '30px' }} />
          ) : (
            <AppButton
              sx={{ mx: 1, width: '60px', height: '40px', marginRight: '26px' }}
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
                label={'Name *'}
                value={formik.values.name || ''}
                onChange={formik.handleChange}
                helperText={formik.touched.name && formik.errors.name}
                error={Boolean(formik.touched.name && formik.errors.name)}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Input
                name="oem"
                label={'OEM *'}
                value={formik.values.oem || ''}
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
                clearFiles={clearFile}
                setFile={setFile}
              />
            </Grid>
            <Grid item md={6} xs={12}></Grid>
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
};

export const AddProduct = memo(Product);
