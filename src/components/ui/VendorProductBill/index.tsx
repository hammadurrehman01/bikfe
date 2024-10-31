import { Card, CardContent } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { List } from 'components';
import { TProduct } from 'interface/product';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import BillService from 'services/bill';

type prop = {
  productID?: TProduct | null;
};
export default function VendorProductBill({ productID }: prop) {
  const user = useSelector((state: RootState) => state.user);
  const [list] = useState([]);
  const billService = new BillService();

  useQuery({
    queryKey: ['GetVendorProductBill', productID],
    queryFn: async () => {
      if (productID) {
        const data = await billService.getVendorProductBill(
          productID.id as number,
          user,
        );
        return data;
      }
      return null;
    },
    retry: 3,
    refetchOnWindowFocus: false,
  });

  const COLUMNS = [
    {
      dataField: 'vendor__company_name',
      caption: 'Name',
    },
    { dataField: 'bill_items__vendor_product__code', caption: 'Code' },
    { dataField: 'bill_items__price', caption: 'Price' },
    { dataField: 'bill_items__quantity', caption: 'Quantity' },
    { dataField: 'date', caption: 'Date' },
  ];
  const mapData = list?.map(
    (item: {
      date: string;
      bill_items__quantity: string;
      bill_items__vendor_product__code: string;
      bill_items__price: number;
      id?: number | undefined;
    }) => {
      const dateFormat = new Date(item?.date);

      const day = String(dateFormat.getDate()).padStart(2, '0');
      const month = String(dateFormat.getMonth() + 1).padStart(2, '0');
      const year = dateFormat.getFullYear();

      const formattedDate = `${day}-${month}-${year}`;
      return {
        ...item,
        date: formattedDate,
      };
    },
  );
  return (
    <div>
      <Card
        sx={{
          borderLeft: '4px solid #0060FF',
          height: '48vh',
          overflowY: 'auto',
          overflowX: 'auto',
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
          Vendor Products
        </div>
        <CardContent sx={{ width: '800px' }}>
          <List columns={COLUMNS} content={mapData} />
        </CardContent>
      </Card>
    </div>
  );
}
