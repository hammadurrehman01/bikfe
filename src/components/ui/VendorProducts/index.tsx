import { Card, CardContent } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { AppLoader, List } from 'components';
import { TProduct } from 'interface/product';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import ProductService from 'services/product';

type prop = {
  productID?: TProduct | null;
};
export default function VendorProducts({ productID }: prop) {
  const user = useSelector((state: RootState) => state.user);
  const productService = new ProductService();

  const { data: vendorProduct, isLoading } = useQuery({
    queryKey: ['getVendorProductsByProductId', productID?.id],
    queryFn: async () => {
      if (productID) {
        const response = await productService.getVendorProductsByProductId(
          productID.id as number,
          user,
        );
        return response.data.data;
      }
      return null;
    },
    retry: 3,
    refetchOnWindowFocus: false,
  });

  const COLUMNS = [
    {
      dataField: 'vendor_name',
      caption: 'Name',
    },
    { dataField: 'code', caption: 'Code' },
    { dataField: 'price', caption: 'Price' },
    { dataField: 'quantity', caption: 'Quantity' },
    { dataField: 'date', caption: 'Date' },
  ];

  const mapData = vendorProduct?.map((item: any) => {
    if (item && item.vendorProduct) {
      const dateFormat = new Date(item.vendorProduct.product.updatedAt);

      const day = String(dateFormat.getDate()).padStart(2, '0');
      const month = String(dateFormat.getMonth() + 1).padStart(2, '0');
      const year = dateFormat.getFullYear();

      const formattedDate = `${day}-${month}-${year}`;
      return {
        id: item.vendorProduct.product.id,
        vendor_name: item.vendorProduct.vendor.companyName,
        code: item.vendorProduct.product.oem,
        price: item.price || 0,
        quantity: item.quantity || 0,
        date: formattedDate,
      };
    }
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
          Vendor Products
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
            <List columns={COLUMNS} content={mapData} />
          </CardContent>
        )}
      </Card>
    </div>
  );
}
