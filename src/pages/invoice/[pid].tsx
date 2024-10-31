import { Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { AppLoader, Layout } from 'components';
import { EditInvoice } from 'components/ui/form/EditInvoice';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import InvoiceService from 'services/invoice';
interface IinVoice {
  id: number;
  date: string;
  status: null;
  currency: {};
  customer: {};
  invoice_item: [];
  created: string;
  modified: string;
}
const Page = () => {
  const [invoiceData, setInvoiceData] = useState<IinVoice>();
  const user = useSelector((state: RootState) => state.user);
  const invoiceService = new InvoiceService();
  const router = useRouter();
  const pid: string | string[] | undefined = router.query.pid;
  const query = useQuery({
    queryKey: ['GetInvoice'],
    queryFn: async () => {
      const data = await invoiceService.GetInvoice(pid, user);
      if (data) {
        setInvoiceData(data.data.data);
        return data;
      }
      return null; // or handle the case where no data is returned
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
        <EditInvoice invoiceData={invoiceData} />
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
