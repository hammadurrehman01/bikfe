import { Box } from '@mui/material';
import { AppLoader, Layout } from 'components';
import { EditCustomer } from 'components/ui/form/EditCustomer';
import { ICustomer, IListCustomer } from 'interface/customer';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { ErrorResponse } from 'interface/ApiError';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from 'redux/store';
import CustomerService from 'services/customer';

const Page = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  const pid: string | string[] = router.query.pid!;
  const [customer, setCustomer] = useState<IListCustomer>();
  const customerService = new CustomerService();
  const queryClient = useQueryClient();

  const { data: customerData, isLoading } = useQuery({
    queryKey: ['GetCustomer', pid],
    queryFn: async () => await customerService.GetCustomer(pid, user),
    retry: 3,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (customerData) {
      setCustomer(customerData?.data.data);
    }
  }, [customerData]);

  const updateCustomer = useMutation({
    mutationFn: async (body: ICustomer) =>
      await customerService.UpdateCustomer(body, pid!, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GetCustomer'] });
      toast.success('Customer Updated Successfully');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error?.response?.data?.error || 'Something Went Wrong');
    },
  });

  const handleSubmit = async (value: ICustomer) => {
    updateCustomer.mutate(value);
  };

  if (isLoading) {
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
        <EditCustomer
          data={customer}
          handleSubmit={handleSubmit}
          loading={updateCustomer.isPending}
        />
      </Box>
    </Box>
  );
};

Page.getLayout = (page: JSX.Element) => (
  <Layout heading={'LIST'}>{page}</Layout>
);
export default Page;

export const getServerSideProps = async () => {
  return { props: {} };
};
