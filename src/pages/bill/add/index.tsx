import { Box } from '@mui/material';
import { Layout } from 'components';
import { AddBill } from 'components/ui/form/AddBill';

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
        <AddBill />
      </Box>
    </Box>
  );
};

Page.getLayout = (page: JSX.Element) => <Layout heading={'ADD'}>{page}</Layout>;

export default Page;
