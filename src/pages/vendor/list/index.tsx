import { Layout } from 'components/ui/Layout';
import { List } from 'components/common/ListComponent';
import { PaginationBar } from 'components/ui/paginationBar';
import { IColumnProps } from 'devextreme-react/data-grid';
import { Box, CircularProgress, Container, TextField } from '@mui/material';
import { useVendorData } from 'hooks/useVendorData';
import { useState } from 'react';
import {
  formatPhoneNumberIntl,
  isValidPhoneNumber,
} from 'react-phone-number-input';
import { VENDOR_URL } from 'routes';
import TablesSkeleton from 'components/common/TableSkeleton';

export default function Page() {
  // TODO: for upload image
  // const router = useRouter();
  // const user = useSelector((state: RootState) => state.user);
  // const [uploadLoader, setUploadLoader] = useState(false);
  const COLUMNS: IColumnProps[] = [
    { dataField: 'companyName', caption: 'Company Name', width: '250px' },
    { dataField: 'number', caption: 'Number' },
    { dataField: 'contactPerson', caption: 'Contact Person' },
    { dataField: 'country', caption: 'Country' },
  ];

  const [search, setSearch] = useState('');
  const {
    vendors,
    isVendorLoading,
    handleNext,
    handlePrevious,
    isPrevious,
    isNext,
  } = useVendorData(search);

  const getValidPhoneNumber = (vendorPhone: any) => {
    if (vendorPhone?.length > 0 && vendorPhone[0]?.number) {
      return isValidPhoneNumber(vendorPhone[0]?.number)
        ? formatPhoneNumberIntl(vendorPhone[0]?.number)
        : vendorPhone[0]?.number;
    }
    return 'No phone';
  };

  const getValidValue = (dataArray: any[], key: string, fallback: string) => {
    return dataArray?.length > 0 && dataArray[0]?.[key]
      ? dataArray[0][key]
      : fallback;
  };

  const TableContent =
    vendors &&
    vendors.map((item: any) => ({
      ...item,
      number: getValidPhoneNumber(item.vendorPhone),
      contactPerson: getValidValue(
        item.vendorPhone,
        'contactPerson',
        'No contact',
      ),
      country: getValidValue(item.vendorAddress, 'country', 'No country'),
    }));

  // TODO: for upload image
  // const fileUpload = async (e: any) => {
  //   const file = e.target.files[0];
  //   if (!file) {
  //     return;
  //   }
  //   setUploadLoader(true);
  //   const data = new FormData();
  //   data.append('file', file);
  //   try {
  //     const res = await vendorService.CreateVendorBulk(data, user);
  //     if (res && res?.data) {
  //       refetch();
  //       toast.success('Vendor Added');
  //       setUploadLoader(false);
  //       return;
  //     }
  //   } catch (e) {
  //     setUploadLoader(false);
  //     toast.error('something went wrong');
  //   }
  // };

  return (
    <div>
      <Box>
        <Container maxWidth={false}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginTop: 30,
              marginBottom: 10,
            }}
          >
            <h2
              style={{
                fontWeight: 700,
                fontSize: '2rem',
                marginLeft: '20px',
                alignSelf: 'end',
              }}
            >
              Vendor List
            </h2>
            <div>
              {/*  TODO: for upload image */}
              {/* <div className="upload-btn-wrapper">
                {uploadLoader ? (
                  <CircularProgress />
                ) : (
                  <>
                    <button className="btn">Upload File</button>
                    <input type="file" name="myfile" onChange={fileUpload} />
                  </>
                )}
              </div> */}
              <TextField
                placeholder="Company Name"
                onChange={e => {
                  setSearch(e.target.value);
                }}
                hiddenLabel
                id="filled-hidden-label-normal"
                variant="filled"
              />
            </div>
          </div>
          {isVendorLoading ? (
            <TablesSkeleton numberOfRows={6} sx={{ gap: '30px' }} />
          ) : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                margin: '20px',
              }}
            >
              <List
                columns={COLUMNS}
                content={TableContent}
                url={VENDOR_URL}
                editCol={true}
                detailCol={true}
              />
            </div>
          )}
          {!!TableContent.length && !isVendorLoading && (
            <PaginationBar
              isNext={isNext}
              isPrevious={isPrevious}
              handlePrevious={handlePrevious}
              handleNext={handleNext}
            />
          )}
        </Container>
      </Box>
    </div>
  );
}

Page.getLayout = (page: JSX.Element) => (
  <Layout heading={'lIST'}>{page}</Layout>
);
