import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from 'redux/store';
import InvoiceService from 'services/invoice';

export const useDownloadInvoice = () => {
  const user = useSelector((state: RootState) => state.user);
  const [downloadID, setDownloadID] = useState();
  const invoiceService = new InvoiceService();

  const { data, isError, isFetching } = useQuery({
    queryKey: ['GetCustomerInvoice', downloadID],
    queryFn: async () => {
      if (downloadID) {
        const invoiceData = await invoiceService.GetInvoice(downloadID, user);
        if (invoiceData && invoiceData.data && invoiceData.data.data) {
          const date = invoiceData.data.data.date.split('T')[0];
          const filename = `${invoiceData.data.data.customer.companyName}-${date}`;
          return await invoiceService.InvoiceDownload(
            downloadID,
            user,
            filename,
          );
        }
      }
      return null;
    },
    retry: 3,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) {
      setDownloadID(undefined);
    }
  }, [data]);

  if (isError) {
    toast.error('Something Went Wrong');
  }

  return { downloadID, setDownloadID, isFetching };
};
