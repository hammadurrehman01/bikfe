import { ICustomers } from 'interface/customer';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import CustomerService from 'services/customer';

export const useCustomerData = (search?: string, isScroll = false) => {
  const customerService = new CustomerService();
  const user = useSelector((state: RootState) => state.user);
  const [data, setData] = useState<ICustomers>([]);
  const [page, setPage] = useState(1);

  const {
    data: customerData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['CustomerList', page, search],
    queryFn: async () => await customerService.CustomerList(user, page, search),
    retry: 3,
    refetchOnWindowFocus: false,
  });

  const isPrevious = customerData?.data.data
    ? customerData?.data.data.hasPreviousPage
    : false;
  const isNext = customerData?.data.data
    ? customerData?.data.data.hasNextPage
    : false;

  useEffect(() => {
    if (search) {
      setPage(1);
    }
  }, [search]);

  useEffect(() => {
    if (page != 1 && customerData?.data.data && !isScroll) {
      setData(customerData?.data.data.customers);
    }
    if (page != 1 && customerData?.data.data && isScroll) {
      setData([...data, ...customerData?.data.data.customers]);
    }
    if (page == 1) {
      setData(customerData?.data.data.customers);
    }
  }, [search, page, customerData?.data.data, isScroll]);

  const handleScroll = (event: any) => {
    const target = event.target as HTMLDivElement;
    const bottom =
      target.scrollHeight - target.scrollTop === target.clientHeight;
    if (bottom && isNext) handleNext();
  };
  const handlePrevious = () => setPage(prev => prev - 1);
  const handleNext = () => setPage(prev => prev + 1);

  const customers = data ? data : [];
  return {
    customers,
    isCustomerLoading: isLoading,
    refetch,
    handleNext,
    handlePrevious,
    handleScroll,
    isPrevious,
    isNext,
  };
};
