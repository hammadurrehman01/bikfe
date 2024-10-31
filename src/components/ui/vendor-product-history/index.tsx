import { Card, CardContent } from '@mui/material';
import { AppLoader, List } from 'components';
import { TProduct } from 'interface/product';
import { IListVendor, IVendor } from 'interface/vendor';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import BillService from 'services/bill';
const COLUMNS1 = [
  { dataField: 'date', caption: 'Date' },
  { dataField: 'price', caption: 'Price' },
  { dataField: 'quantity', caption: 'Quantity' },
];
type prop = {
  vendorID?: IVendor;
  productID?: TProduct | null;
};
export default function VendorProductHistory({ vendorID, productID }: prop) {
  const user = useSelector((state: RootState) => state.user);
  const [list] = useState([]);

  const billService = new BillService();

  const { data: history, isLoading } = useQuery({
    queryKey: ['GetVendorProductHistory', productID, vendorID],
    queryFn: async () => {
      if (productID && vendorID) {
        const response = await billService.getVendorProductHistory(
          vendorID?.id as number,
          productID?.id as number,
          user,
        );
        return response.data.data;
      }
      return null;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  const mapData = history?.map((item: any) => {
    const dateFormat = new Date(item?.vendorProduct.product.updatedAt);

    const day = String(dateFormat.getDate()).padStart(2, '0');
    const month = String(dateFormat.getMonth() + 1).padStart(2, '0');
    const year = dateFormat.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;

    return {
      ...item,
      date: formattedDate,
    };
  });

  return (
    <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
      <Card
        sx={{
          borderLeft: '4px solid #0060FF',
          height: '48vh',
          overflow: isLoading ? 'hidden' : 'scroll',
          width: '100%',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '16px',
          }}
        >
          Vendor Products History
        </div>
        {isLoading ? (
          <div
            style={{
              height: '90%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AppLoader sx={{ height: '0' }} />
          </div>
        ) : (
          <CardContent
            sx={{
              padding: '5px',
              overflowX: 'auto',
            }}
          >
            <List columns={COLUMNS1} content={mapData} />
          </CardContent>
        )}
      </Card>
    </div>
  );
}
