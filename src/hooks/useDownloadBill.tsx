import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from 'redux/store';
import BillService from 'services/bill';

export const useDownloadBill = () => {
  const user = useSelector((state: RootState) => state.user);
  const billService = new BillService();

  const [downloadID, setDownloadID] = useState();

  const query = useQuery({
    queryKey: ['GetVendorBill', downloadID],
    queryFn: async () => {
      try {
        if (downloadID) {
          const billData = await billService.GetBill(downloadID, user);
          if (billData && billData.data && billData.data.data) {
            const date = billData.data.data.date.split('T')[0];
            const filename = `${billData.data.data.vendor.companyName}-${date}`;
            const result = await billService.BillDownload(
              downloadID,
              user,
              filename,
            );
            setDownloadID(undefined);
            return result;
          }
        }
        return null;
      } catch (err) {
        toast.error('Something Went Wrong');
        throw err; // rethrow the error after handling it
      }
    },
    retry: 3,
    refetchOnWindowFocus: false,
  });
  return { downloadID, setDownloadID, isFetching: query.isFetching };
};
