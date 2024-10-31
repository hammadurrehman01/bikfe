import { IListVendor } from 'interface/vendor';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import VendorService from 'services/vendor';

export const useVendorData = (search?: string, isScroll = false) => {
  const vendorService = new VendorService();
  const user = useSelector((state: RootState) => state.user);
  const [data, setData] = useState<IListVendor[]>([]);
  const [page, setPage] = useState(1);

  const {
    data: vendorData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['ListVendors', page, search],
    queryFn: async () => await vendorService.ListVendor(user, page, search),
    retry: 3,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (vendorData) {
      setData(vendorData?.data?.data);
    }
  }, [vendorData]);

  const isPrevious = vendorData?.data.data
    ? vendorData?.data.data.hasPreviousPage
    : false;
  const isNext = vendorData?.data.data
    ? vendorData?.data.data.hasNextPage
    : false;

  useEffect(() => {
    if (search) {
      setPage(1);
    }
  }, [search]);

  useEffect(() => {
    if (page != 1 && vendorData?.data.data && !isScroll) {
      setData(vendorData?.data.data.vendors);
    }

    if (page != 1 && vendorData?.data.data && isScroll) {
      setData([...data, ...vendorData?.data.data.vendors]);
    }

    if (page == 1) {
      setData(vendorData?.data.data.vendors);
    }
  }, [search, page, vendorData?.data.data]);

  const handleVendorScroll = (event: any) => {
    const target = event.target as HTMLDivElement;

    const isNearBottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight + 1;

    if (isNext && isNearBottom) handleNext();
  };

  const handlePrevious = () => setPage(prev => prev - 1);
  const handleNext = () => setPage(prev => prev + 1);
  const vendors = data ? data : [];
  return {
    handleVendorScroll,
    vendors,
    isVendorLoading: isLoading,
    refetch,
    handleNext,
    handlePrevious,
    isPrevious,
    isNext,
  };
};
