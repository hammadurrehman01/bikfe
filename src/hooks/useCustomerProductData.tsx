import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from 'redux/store';
import CustomerService from 'services/customer';

export const useCustomerProductData = (customerId: string, search?: string) => {
  const customerService = new CustomerService();
  const user = useSelector((state: RootState) => state.user);

  const [page, setPage] = useState(1);
  const [data, setData] = useState<any>([]);

  const {
    data: customerProductData,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['ListCustomerProducts', page, search],
    queryFn: async () => {
      return await customerService.GetCustomerProduct(
        user,
        customerId,
        page,
        search,
      );
    },
    retry: 3,
    refetchOnWindowFocus: false,
  });

  const isPrevious = customerProductData?.data.data
    ? customerProductData?.data.data.hasPreviousPage
    : false;
  const isNext = customerProductData?.data.data
    ? customerProductData?.data.data.hasNextPage
    : false;

  useEffect(() => {
    if (search) {
      setPage(1);
    }
    if (page != 1 && customerProductData) {
      setData(customerProductData);
    }
    if (page != 1 && customerProductData) {
      setData([...data, customerProductData]);
    }
    if (page == 1) {
      setData(customerProductData);
    }
  }, [search, page, customerProductData]);

  const handleScroll = (event: any) => {
    const target = event.target as HTMLDivElement;
    const bottom =
      target.scrollHeight - target.scrollTop === target.clientHeight;
    if (bottom && isNext) handleNext();
  };

  const handlePrevious = () => setPage(prev => prev - 1);
  const handleNext = () => setPage(prev => prev + 1);

  return {
    customerProductData: data,
    isLoading,
    refetch,
    handleNext,
    isFetching,
    handlePrevious,
    handleScroll,
    isPrevious,
    isNext,
  };
};
