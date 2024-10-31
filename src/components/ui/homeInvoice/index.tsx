import { AppLoader, List } from 'components';
import { useInvoiceData } from 'hooks/useInvoiceData';
import { INVOICE_EDIT_URL } from 'routes';
import { PaginationBar } from '../paginationBar';
import { useDownloadInvoice } from 'hooks/useDownloadInvoice';
import TablesSkeleton from 'components/common/TableSkeleton';

export default function HomeInvoice() {
  const {
    invoices,
    isNext,
    isPrevious,
    handleNext,
    handlePrevious,
    isFetching,
  } = useInvoiceData();

  const {
    downloadID,
    setDownloadID,
    isFetching: downloadLoading,
  } = useDownloadInvoice();
  const COLUMNS = [
    { dataField: 'date', caption: 'Date' },
    { dataField: 'company_name', caption: 'Customer' },
  ];
  const mapData =
    invoices &&
    invoices.map((item: any) => {
      const dateFormat = new Date(item?.date);

      const day = String(dateFormat.getDate()).padStart(2, '0');
      const month = String(dateFormat.getMonth() + 1).padStart(2, '0');
      const year = dateFormat.getFullYear();

      const formattedDate = `${day}-${month}-${year}`;
      return {
        ...item,
        date: formattedDate,
        company_name: item?.customer?.companyName,
      };
    });
  return (
    <div>
      <div>
        <p style={{ fontSize: '24px', marginLeft: '8px' }}> Invoices</p>

        {isFetching ? (
          <div>
            <TablesSkeleton numberOfRows={4} sx={{ gap: '30px' }} />
          </div>
        ) : (
          <div style={{ margin: '10px' }}>
            <List
              columns={COLUMNS}
              content={mapData}
              url={INVOICE_EDIT_URL}
              editCol={true}
              downloadCol={true}
              downloadID={setDownloadID}
              selectedDownloadId={downloadID}
              downloadLoading={downloadLoading}
            />
            <PaginationBar
              isNext={isNext}
              isPrevious={isPrevious}
              handlePrevious={handlePrevious}
              handleNext={handleNext}
            />
          </div>
        )}
      </div>
    </div>
  );
}
