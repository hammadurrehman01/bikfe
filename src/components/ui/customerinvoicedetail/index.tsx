import { List } from 'components';
import { CustomizeDatePicker } from 'components/common/DatePicker';
import TablesSkeleton from 'components/common/TableSkeleton';
import dayjs from 'dayjs';
import { useCustomerInvoiceData } from 'hooks/useCustomerInvoiceData';
import { useDownloadInvoice } from 'hooks/useDownloadInvoice';
import { useState } from 'react';
import { PaginationBar } from '../paginationBar';

type prop = {
  id: number | string;
};

export default function CustomerInvoiceDetail({ id }: prop) {
  const INVOICE = [{ dataField: 'date', caption: 'date' }];

  const [search, setSearch] = useState('');
  const {
    invoices,
    handleNext,
    handlePrevious,
    isPrevious,
    isNext,
    isLoading,
  } = useCustomerInvoiceData(id as string, dayjs(search).format('DD-MM-YYYY'));

  const { downloadID, setDownloadID } = useDownloadInvoice();

  const mapData =
    invoices &&
    invoices.map((item: any) => {
      const formattedDate = dayjs(item.date).format('DD-MM-YYYY');

      return {
        ...item,
        date: formattedDate,
      };
    });

  const handleChangeDate = (newValue: any) => {
    setSearch(newValue);
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
        <h2 style={{ fontWeight: 700, fontSize: '2rem' }}>Invoices</h2>

        <CustomizeDatePicker value={search} onChange={handleChangeDate} sx={{marginTop: "0"}} />
      </div>
      {isLoading ? (
        <TablesSkeleton numberOfRows={2} />
      ) : (
        <List
          columns={INVOICE}
          content={mapData ?? []}
          downloadCol={true}
          downloadID={setDownloadID}
          selectedDownloadId={downloadID}
          // downloadLoading={downloadLoading}
        />
      )}
      {!!mapData.length && (
        <PaginationBar
          isNext={isNext}
          isPrevious={isPrevious}
          handlePrevious={handlePrevious}
          handleNext={handleNext}
        />
      )}
    </>
  );
}
