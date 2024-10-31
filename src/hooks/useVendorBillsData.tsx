import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import VendorService from 'services/vendor';

export const useVendorBillsData = (
  customerId: string,
  search?: string,
  isScroll = false,
) => {
  const vendorService = new VendorService();
  const user = useSelector((state: RootState) => state.user);

  const [page, setPage] = useState(1);
  const [data, setData] = useState<any[]>([]);

  const {
    data: apiData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['ListCustomerInvoice', page, search],
    queryFn: async () => {
      const response = await vendorService.ListVendorBill(
        user,
        customerId,
        page,
        search,
      );

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
    if (page != 1 && apiData?.data.data && !isScroll) {
      setData(apiData?.data.data.vendorBills);
    }
    if (page != 1 && apiData?.data.data && isScroll) {
      setData(prev => [...prev, ...apiData?.data.data.vendorBills]);
    }
    if (page == 1) {
      setData(apiData?.data?.data.vendorBills);
    }
  }, [search, page, apiData?.data.data.vendorBills]);

  const handleScroll = (event: any) => {
    const target = event.target as HTMLDivElement;
    const bottom =
      target.scrollHeight - target.scrollTop === target.clientHeight;
    if (bottom && isNext) handleNext();
  };

  const handlePrevious = () => setPage(prev => prev - 1);
  const handleNext = () => setPage(prev => prev + 1);

  const bills = data ? data : [];

  return {
    bills,
    isLoading,
    refetch,
    handleNext,
    handlePrevious,
    handleScroll,
    isPrevious,
    isNext,
  };
};
