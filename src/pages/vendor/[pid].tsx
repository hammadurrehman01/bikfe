import { Box } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Layout } from 'components';
import { EditVendor } from 'components/ui/form/EditVendor';
import { ErrorResponse } from 'interface/ApiError';
import { IVendor } from 'interface/vendor';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from 'redux/store';
import VendorService from 'services/vendor';

const Page = () => {
  const user = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const pid = router.query.pid;
  const [vendor, setVendor] = useState();
  const vendorService = new VendorService();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['GetVendor'],
    queryFn: async () => {
      const data = await vendorService.GetVendorById(pid, user);

      if (data) {
        setVendor(data?.data.data);
      }
      return data;
    },
    retry: 3,
    refetchOnWindowFocus: false,
  });

  const UpdateVendor = useMutation({
    mutationFn: async (body: IVendor) =>
      await vendorService.UpdateVendor(body, pid, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor'] });
      toast.success('Vendor Updated Successfully');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error?.response?.data?.error || 'Something Went Wrong');
    },
  });

  const handleSubmit = async (value: IVendor) => {
    UpdateVendor.mutate(value);
  };

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
        <EditVendor
          data={vendor}
          handleSubmit={handleSubmit}
          loading={UpdateVendor.isPending}
        />
      </Box>
    </Box>
  );
};

Page.getLayout = (page: JSX.Element) => (
  <Layout heading={'UPDATE'}>{page}</Layout>
);
export default Page;

export const getServerSideProps = async () => {
  return { props: {} };
};
