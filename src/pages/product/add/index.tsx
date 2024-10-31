import { Box } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Layout } from 'components';
import { AddProduct } from 'components/ui/form/AddProduct';
import { IProductInput } from 'interface/product';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from 'redux/store';
import ProductService from 'services/product';
import { uploadAssetToS3 } from 'services/storage.service';
const Page = () => {
  const productService = new ProductService();
  const queryClient = useQueryClient();
  const user = useSelector((state: RootState) => state.user);

  const router = useRouter();
  const createProduct = useMutation({
    mutationFn: async (body: IProductInput) => {
      return await productService.CreateProduct(body, user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product'] });
      toast.success('Product Added Successfully');
      router.push('/product/list');
    },
    onError: (error: any) => {
      if (error?.response?.data?.name) {
        toast.error('Product with this Name already exists.');
      } else if (error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Something Went Wrong');
      }
    },
  });

  const handleSubmit = async (data: IProductInput) => {
    try {
      let s3Response;
      if (data.image) {
        s3Response = await uploadAssetToS3(data.image as File);
      }
      const values: IProductInput = {
        name: data.name,
        oem: data.oem,
        image: null,
      };
      if (s3Response && s3Response.status === 200) {
        values['image'] = s3Response.key;
      }
      createProduct.mutate(values);
    } catch (err) {
      toast.error('Something Went Wrong');
    }
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 6 }}>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}
      >
        <AddProduct
          handleSubmit={handleSubmit}
          loading={createProduct.isPending}
        />
      </Box>
    </Box>
  );
};

Page.getLayout = (page: JSX.Element) => <Layout heading={'ADD'}>{page}</Layout>;

export default Page;
