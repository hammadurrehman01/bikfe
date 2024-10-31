import { Box } from '@mui/material';
import { Layout } from 'components';
import { AddVendor } from 'components/ui/form/AddVendor';
import { VENDOR_ADD_URL } from 'routes';
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
        <AddVendor listURL={`${VENDOR_ADD_URL}`} title="Add Vendor" />
      </Box>
    </Box>
  );
};

Page.getLayout = (page: JSX.Element) => <Layout heading={'ADD'}>{page}</Layout>;

export default Page;
