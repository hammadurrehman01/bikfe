import { Box } from '@mui/material';
import { Layout } from 'components';
import { AddInvoice } from 'components/ui/form/AddInvoice';

const Page = () => {
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
        <AddInvoice />
      </Box>
    </Box>
  );
};

Page.getLayout = (page: JSX.Element) => <Layout heading={'ADD'}>{page}</Layout>;

export default Page;
