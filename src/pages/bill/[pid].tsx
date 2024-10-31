import { Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { AppLoader, Layout } from 'components';
import { EditBill } from 'components/ui/form/EditBill';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import BillService from 'services/bill';
interface IinVoice {
  id: number;
  date: string;
  status: null;
  currency: {};
  vendor: {};
  bill_item: [];
  created: string;
  modified: string;
}
const Page = () => {
  const [billData, setBillData] = useState<IinVoice>();
  const user = useSelector((state: RootState) => state.user);
  const billService = new BillService();
  const router = useRouter();
  const pid: string | string[] | undefined = router.query.pid;

  const query = useQuery({
    queryKey: ['GetBill', pid],
    queryFn: async () => {
      const response = await billService.GetBill(pid, user);
      if (response.data.data) {
        setBillData(response.data.data);
      }
      return response;
    },
    retry: 3,
    refetchOnWindowFocus: false,
  });

  if (query.isLoading) {
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
        <EditBill billData={billData} />
      </Box>
    </Box>
  );
};

Page.getLayout = (page: JSX.Element) => (
  <Layout heading={'EDIT'}>{page}</Layout>
);

export default Page;

export const getServerSideProps = async () => {
  return { props: {} };
};
