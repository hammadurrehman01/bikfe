import { Box } from '@mui/material';
import { AppLoader, Layout } from 'components/index';
import { AxiosError } from 'axios';
import { ErrorResponse } from 'interface/ApiError';
import { EditProduct } from 'components/ui/form/EditProduct';
import { CreateProductInput, TProduct } from 'interface/product';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from 'redux/store';
import ProductService from 'services/product';
import { GetAssetFromS3ByKey, uploadAssetToS3 } from 'services/storage.service';
export default function Page() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  const pid = router.query.pid;
  const [product, setProduct] = useState<TProduct>();
  const productService = new ProductService();
  const queryClient = useQueryClient();

  const [imageKey, setImageKey] = useState('');
  const query = useQuery({
    queryKey: ['GetProduct', pid],
    queryFn: async () => {
      const data = await productService.GetProductById(pid, user);

      // Handling data after fetching
      if (data && data.data.data.id !== product?.id) {
        let fileUrl = data.data.data.image as string;
        if (fileUrl) {
          fileUrl = await GetAssetFromS3ByKey(fileUrl);
        }
        setImageKey(data.data.data.image);

        const productDetails = fileUrl
          ? { ...data.data.data, image: fileUrl }
          : data.data.data;

        setProduct(productDetails);
      }

      return data; // Ensure data is returned for useQuery to manage
    },
    retry: 3,
    refetchOnWindowFocus: false,
  });

  const UpdateProduct = useMutation({
    mutationFn: async (body: CreateProductInput) =>
      await productService.UpdateProduct(body, pid, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ListCustomer'] });
      toast.success('Product Updated Successfully');
      router.push('/product/list');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error?.response?.data?.error || 'Something Went Wrong');
    },
  });

  const handleSubmit = async (data: CreateProductInput) => {
    try {
      let s3Response;
      if (data.image instanceof File) {
        s3Response = await uploadAssetToS3(data.image as File);
      }
      const values: CreateProductInput = {
        id: pid as string,
        name: data.name,
        oem: data.oem,
        image: null,
      };
      if (data.image) {
        values['image'] = imageKey;
      }
      if (s3Response && s3Response.status === 200) {
        values['image'] = s3Response.key;
      }
      UpdateProduct.mutate(values);
    } catch (err) {
      toast.error('Something Went Wrong');
    }
  };

  const renderEditProduct = useMemo(() => {
    return (
      <EditProduct
        data={product}
        handleSubmit={handleSubmit}
        loading={UpdateProduct.isPending}
      />
    );
  }, [product, UpdateProduct.isPending]);
  if (query.isLoading) {
    return <AppLoader />;
  }
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
        {renderEditProduct}
      </Box>
    </Box>
  );
}

Page.getLayout = (page: JSX.Element) => (
  <Layout heading={'LIST'}>{page}</Layout>
);
// export default Page;

export const getServerSideProps = async () => {
  return { props: {} };
};
