import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import BillService from 'services/bill';

export const useBillData = (
  search?: string,
  companyName?: string,
  isScroll = false,
) => {
  const user = useSelector((state: RootState) => state.user);
  const billService = new BillService();
  const [_data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  const {
    data: apiData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['ListBill', page, search, companyName],
    queryFn: async () => {
      try {
        const response = await billService.ListBill(
          user,
          page,
          search,
          companyName,
        );
        return response;
      } catch (err) {
        throw err;
      }
    },
    retry: false,
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
      setData(apiData?.data.data);
    }
    if (page != 1 && apiData?.data.data && isScroll) {
      setData(prev => [...prev, ...apiData?.data.data]);
    }
    if (page == 1) {
      setData(apiData?.data?.data?.bills);
    }
  }, [search, page, apiData?.data.data, isScroll]);

  const handleScroll = (event: any) => {
    const target = event.target as HTMLDivElement;
    const bottom =
      target.scrollHeight - target.scrollTop === target.clientHeight;
    if (bottom && isNext) handleNext();
  };
  const handlePrevious = () => setPage(prev => prev - 1);
  const handleNext = () => setPage(prev => prev + 1);

  return {
    apiData,
    isLoading,
    refetch,
    handleNext,
    handlePrevious,
    handleScroll,
    isPrevious,
    isNext,
  };
};
