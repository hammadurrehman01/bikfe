import { AppLoader, List } from 'components';
import { useBillData } from 'hooks/useBillData';
import { BILL_EDIT_URL } from 'routes';
import { PaginationBar } from '../paginationBar';
import { useDownloadBill } from 'hooks/useDownloadBill';
import TablesSkeleton from 'components/common/TableSkeleton';

export default function HomeBill() {
  const {
    downloadID,
    setDownloadID,
    isFetching: downloadLoading,
  } = useDownloadBill();
  const { apiData, isNext, isPrevious, handleNext, handlePrevious, isLoading } =
    useBillData();
  const COLUMNS = [
    { dataField: 'date', caption: 'Date' },
    { dataField: 'company_name', caption: 'Vendor' },
  ];
  const mapData =
    apiData &&
    apiData.data.data.bills.map((item: any) => {
      const dateFormat = new Date(item?.date);

      const day = String(dateFormat.getDate()).padStart(2, '0');
      const month = String(dateFormat.getMonth() + 1).padStart(2, '0');
      const year = dateFormat.getFullYear();

      const formattedDate = `${day}-${month}-${year}`;
      return {
        ...item,
        date: formattedDate,
        company_name: item?.vendor?.companyName,
      };
    });

  return (
    <div>
      <div>
        <p style={{ fontSize: '24px', marginLeft: '8px' }}> Bills</p>

        {isLoading ? (
          <TablesSkeleton numberOfRows={4} sx={{ gap: '30px' }} />
        ) : (
          <div style={{ margin: '10px' }}>
            <List
              columns={COLUMNS}
              content={mapData}
              url={BILL_EDIT_URL}
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
