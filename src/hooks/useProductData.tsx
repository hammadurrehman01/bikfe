import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import ProductService from 'services/product';
import { GetAssetFromS3ByKey } from 'services/storage.service';

export const useProductData = (search?: string, isScroll = false) => {
  const productService = new ProductService();
  const user = useSelector((state: RootState) => state.user);
  const [data, setData] = useState<any[]>([]);
  const [dataWithImage, setDataWithImage] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  const {
    data: apiData,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['ListProducts', page, search],
    queryFn: async () => {
      const response = await productService.ListProduct(page, user, search);

      if (response.data.data) {
        const products = response.data.data.products;
        const updatedProducts = await Promise.all(
          products.map(async (product: any) => {
            let fileUrl = product.image as string;
            if (fileUrl) {
              fileUrl = await GetAssetFromS3ByKey(fileUrl);
            }
            return {
              ...product,
              image: fileUrl,
            };
          }),
        );
        setDataWithImage(updatedProducts);
      }

      return response;
    },
    retry: 3,
    refetchOnWindowFocus: false,
  });

  const isPrevious = apiData?.data.data
    ? apiData?.data.data.hasPreviousPage
    : false;
  const isNext = apiData?.data.data ? apiData?.data.data.hasNextPage : false;

  useEffect(() => {
    if (search) {
      setPage(1);
    }
  }, [search]);

  useEffect(() => {
    if (page != 1 && dataWithImage && !isScroll) {
      setData(dataWithImage);
    }
    if (page != 1 && dataWithImage && isScroll) {
      setData(prev => [...prev, ...dataWithImage]);
    }
    if (page == 1) {
      setData(dataWithImage);
    }
  }, [search, page, dataWithImage]);

  const handlePrevious = () => setPage(prev => prev - 1);
  const handleNext = () => setPage(prev => prev + 1);

  const products = data ? data : [];
  return {
    products,
    isProductLoading: isFetching,
    // isPending,
    refetch,
    handleNext,
    handlePrevious,
    isPrevious,
    isNext,
  };
};
