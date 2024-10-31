import { Box, CircularProgress, Container, TextField } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Layout, List } from 'components';
import { PaginationBar } from 'components/ui/paginationBar';
import { AxiosError } from 'axios';
import { ErrorResponse } from 'interface/ApiError';
import { IColumnProps } from 'devextreme-react/data-grid';
import { useBillData } from 'hooks/useBillData';
import { useDownloadBill } from 'hooks/useDownloadBill';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from 'redux/store';
import { BILL_EDIT_URL } from 'routes';
import BillService from 'services/bill';

import { useDebounce } from 'use-debounce';
import TablesSkeleton from 'components/common/TableSkeleton';
import { CustomizeDatePicker } from 'components/common/DatePicker';
import dayjs from 'dayjs';
export default function Page() {
  const user = useSelector((state: RootState) => state.user);
  const billService = new BillService();
  const COLUMNS: IColumnProps[] = [
    { dataField: 'date', caption: 'Date' },
    { dataField: 'companyName', caption: 'Company Name', width: '250px' },
    { dataField: 'currency', caption: 'Currency' },
  ];
  const queryClient = useQueryClient();

  const {
    downloadID,
    setDownloadID,
    isFetching: downloadLoading,
  } = useDownloadBill();

  const [search, setSearch] = useState('');
  const [companyName, setCompanyName] = useState('');

  const {
    apiData,
    isLoading,
    refetch,
    handleNext,
    handlePrevious,
    isPrevious,
    isNext,
  } = useBillData(
    search ? dayjs(search).format('DD-MM-YYYY') : '',
    companyName,
  );

  const mapData =
    apiData &&
    apiData.data.data.bills.map((item: any) => {
      const formattedDate = dayjs(item.date).format('DD-MM-YYYY');

      return {
        ...item,
        date: formattedDate,
        companyName: item?.vendor?.companyName,
      };
    });

  const deleteBill = useMutation({
    mutationFn: async (deleteid: number | undefined | string) => {
      const response = await billService.BillDelete(deleteid, user);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['DeleteVendorProduct'] });
      refetch();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error?.response?.data?.error || 'Something Went Wrong');
    },
  });

  const deleteFunction = (id: number | string) => {
    deleteBill.mutate(id);
  };

  const handleChangeDate = (newValue: any) => {
    setSearch(newValue);
  };

  return (
    <div>
      <Box>
        <Container maxWidth={false}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 30,
              marginBottom: 10,
            }}
          >
            <h2 style={{ fontWeight: 700, fontSize: '2rem' }}>Bill List</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CustomizeDatePicker
                value={search}
                onChange={handleChangeDate}
                sx={{ marginTop: '0' }}
              />
              <TextField
                sx={{
                  width: '320px',
                  borderRadius: '20px !important',
                  fieldset: {
                    border: '1px solid #88888a',
                  },
                }}
                placeholder="Company Name"
                onChange={e => {
                  setCompanyName(e.target.value);
                }}
                hiddenLabel
                id="filled-hidden-label-normal"
              />
            </div>
          </div>
          {isLoading ? (
            <TablesSkeleton numberOfRows={6} sx={{ gap: '20px' }} />
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
                content={mapData}
                url={BILL_EDIT_URL}
                deleteCol={true}
                editCol={true}
                downloadCol={true}
                deleteFunction={deleteFunction}
                downloadID={setDownloadID}
                selectedDownloadId={downloadID}
                downloadLoading={downloadLoading}
              />
            </div>
          )}
          <PaginationBar
            isNext={isNext}
            isPrevious={isPrevious}
            handlePrevious={handlePrevious}
            handleNext={handleNext}
          />
        </Container>
      </Box>
    </div>
  );
}

Page.getLayout = (page: JSX.Element) => (
  <Layout heading={'lIST'}>{page}</Layout>
);
