import { List } from 'components';
import { CustomizeDatePicker } from 'components/common/DatePicker';
import TablesSkeleton from 'components/common/TableSkeleton';
import { Dayjs } from 'dayjs';
import { useDownloadBill } from 'hooks/useDownloadBill';
import { useVendorBillsData } from 'hooks/useVendorBillsData';
import { useState } from 'react';
import { PaginationBar } from '../paginationBar';
import { Stack } from '@mui/material';

type prop = {
  id: number | string;
};
export default function VendorBillDetail({ id }: prop) {
  const BILL = [{ dataField: 'date', caption: 'date' }];
  const {
    downloadID,
    setDownloadID,
    isFetching: downloadLoading,
  } = useDownloadBill();

  const [search, setSearch] = useState('');
  const [value, setValue] = useState<Dayjs | null>(null);
  const { bills, handleNext, handlePrevious, isPrevious, isNext, isLoading } =
    useVendorBillsData(id as string, search);

  const mapData =
    bills &&
    bills.map((item: any) => {
      const dateFormat = new Date(item?.date);

      const day = String(dateFormat.getDate()).padStart(2, '0');
      const month = String(dateFormat.getMonth() + 1).padStart(2, '0');
      const year = dateFormat.getFullYear();

      const formattedDate = `${day}-${month}-${year}`;
      return {
        ...item,
        date: formattedDate,
      };
    });

  const handleChangeDate = (newValue: any) => {
    setValue(newValue);
    setSearch(newValue.format('DD-MM-YYYY'));
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '20px',
        }}
      >
        <h2 style={{ fontWeight: 700, fontSize: '2rem' }}>Bills</h2>
        <CustomizeDatePicker
          value={value}
          onChange={handleChangeDate}
          sx={{ marginTop: '0' }}
        />
      </div>
      {isLoading ? (
        <TablesSkeleton numberOfRows={3} />
      ) : (
        <List
          columns={BILL}
          content={mapData}
          downloadCol={true}
          downloadID={setDownloadID}
          selectedDownloadId={downloadID}
          downloadLoading={downloadLoading}
        />
      )}
      <PaginationBar
        isNext={isNext}
        isPrevious={isPrevious}
        handlePrevious={handlePrevious}
        handleNext={handleNext}
      />
    </>
  );
}
