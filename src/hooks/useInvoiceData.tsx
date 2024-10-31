import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import InvoiceService from 'services/invoice';

export const useInvoiceData = (
  search?: string,
  companyName?: string,
  isScroll = false,
) => {
  const user = useSelector((state: RootState) => state.user);
  const invoiceService = new InvoiceService();
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  const {
    data: apiData,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['ListInvoice', page, search, companyName],
    queryFn: async () => {
      try {
        return await invoiceService.ListInvoice(
          user,
          page,
          search,
          companyName,
        );
      } catch (err) {
        throw err;
      }
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
      setData(apiData?.data.data.invoices);
    }
    if (page != 1 && apiData?.data.data && isScroll) {
      setData(prev => [...prev, ...apiData?.data.data.invoices]);
    }
    if (page == 1) {
      setData(apiData?.data?.data?.invoices);
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

  const invoices = data ? data : [];
  return {
    invoices,
    isFetching,
    refetch,
    handleNext,
    handlePrevious,
    handleScroll,
    isPrevious,
    isNext,
  };
};
