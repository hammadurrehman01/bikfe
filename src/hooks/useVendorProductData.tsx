import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import VendorService from 'services/vendor';

export const useVendorProductData = (pid: string, search?: string) => {
  const vendorService = new VendorService();
  const user = useSelector((state: RootState) => state.user);

  const [page, setPage] = useState(1);

  const {
    data: vendorProductData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['ListVendorProducts', page, search],
    queryFn: async () => {
      const response = await vendorService.GetvendorProduct(
        user,
        pid,
        page,
        search,
      );
      return response;
    },
    retry: 3,
    refetchOnWindowFocus: false,
  });

  const isPrevious = vendorProductData?.data.data
    ? vendorProductData?.data.data.hasPreviousPage
    : false;
  const isNext = vendorProductData?.data.data
    ? vendorProductData?.data.data.hasNextPage
    : false;

  const handleScroll = (event: any) => {
    const target = event.target as HTMLDivElement;
    const bottom =
      target.scrollHeight - target.scrollTop === target.clientHeight;
    if (bottom && isNext) handleNext();
  };

  const handlePrevious = () => setPage(prev => prev - 1);
  const handleNext = () => setPage(prev => prev + 1);

  return {
    vendorProductData,
    isLoading,
    isFetching,
    handleNext,
    handlePrevious,
    handleScroll,
    isPrevious,
    isNext,
  };
};
