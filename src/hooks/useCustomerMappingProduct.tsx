import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import CustomerService from 'services/customer';
import { GetAssetFromS3ByKey } from 'services/storage.service';

export const useCustomerMappingProduct = () => {
  const user = useSelector((state: RootState) => state.user);
  const customerService = new CustomerService();

  const [data, setData] = useState<any>({});

  const [input, setInput] = useState<any>({});

  const { data: customerMappingData } = useQuery({
    queryKey: ['GetCustomerMapping', input.customerId, input.productId],
    queryFn: async () => {
      if (input.customerId && input.productId) {
        return await customerService.GetCustomerMappingCode(
          input.customerId,
          input.productId,
          user,
        );
      }
      return null;
    },
    retry: 3,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const handleData = async () => {
      if (customerMappingData?.data?.data) {
        let fileUrl = customerMappingData.data.data.product.image as string;
        if (fileUrl) {
          fileUrl = await GetAssetFromS3ByKey(fileUrl);
        }
        setData({
          ...data.data.data,
          product: {
            ...data.data.data.product,
            image: fileUrl,
          },
        });
        setInput({});
      }
    };

    handleData();
  }, [data]);

  return { setInput, mappingProduct: data ? data : null };
};
