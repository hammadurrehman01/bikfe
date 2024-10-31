import { Card, CardContent } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { AppLoader, List } from 'components';
import { ICustomer, IListCustomer } from 'interface/customer';
import { TProduct } from 'interface/product';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import InvoiceService from 'services/invoice';

const COLUMNS1 = [
  { dataField: 'date', caption: 'Date' },
  { dataField: 'price', caption: 'Price' },
  { dataField: 'quantity', caption: 'Quantity' },
];
type prop = {
  customerID?: IListCustomer | ICustomer;
  productID?: TProduct | null;
};
export default function CustomerProductHistory({
  customerID,
  productID,
}: prop) {
  const user = useSelector((state: RootState) => state.user);
  const [idsSelected, setIdsSelected] = useState(false);

  const invoiceService = new InvoiceService();

  useEffect(() => {
    if (productID && customerID) {
      setIdsSelected(true);
    }
  }, [productID, customerID]);

  useQuery({
    queryKey: ['GetVendorProductInvoice', productID, customerID],
    enabled: !!idsSelected,
    queryFn: async () => {
      if (productID && customerID) {
        return await invoiceService.getCustomerProductHistory(
          customerID?.id as number,
          productID?.id as number,
          user,
        );
      }
    },
  });

  const { data: history, isLoading } = useQuery({
    queryKey: ['GetCustomerProductHistory', productID, customerID],
    queryFn: async () => {
      if (productID && customerID) {
        const response = await invoiceService.getCustomerProductHistory(
          customerID?.id as number,
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
    const dateFormat = new Date(item?.customerProduct.product.updatedAt);

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
          Customer Products History
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
