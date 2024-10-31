import axios, { AxiosRequestConfig } from 'axios';
import { downloadExcel } from 'helpers/helper';
import {
  Bill,
  IBillWithBillItems,
  IUpdateBillWithBillItems,
} from 'interface/bill';
import { IUser } from 'interface/user';
import { toast } from 'react-toastify';

export default class BillService {
  BillDownload = async (billId: number, user: IUser, name: string) => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: `/api/bill/downloadExcel/${billId}`,
      responseType: 'arraybuffer',
      headers: {
        Authorization: 'Bearer ' + user?.key,
        'Content-Disposition': `attachment; filename=${name}.xlsx`,
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    };

    const response = await axios(config);

    await downloadExcel(response, name);
    return response;
  };

  GetBill = async (billId: string | string[] | undefined, user: IUser) => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: `/api/bill/${billId}`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
      },
    };
    const response = await axios(config);
    return response;
  };

  ListBill = async (
    user: IUser,
    page: number,
    search?: string,
    companyName?: string,
  ) => {
    let url = `/api/bill?page=${page}`;
    if (search) url += `&date=${search}`;
    if (companyName) url += `&company=${companyName}`;
    const config: AxiosRequestConfig = {
      method: 'GET',
      url,
      headers: {
        Authorization: 'Bearer ' + user?.key,
      },
    };
    const response = await axios(config);
    return response;
  };

  CreateBill = async (body: IBillWithBillItems, user?: IUser) => {
    const config: AxiosRequestConfig = {
      method: 'post',
      url: `/api/bill`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
        'Content-Type': 'application/json',
      },
      data: body,
    };
    const response = await axios(config);
    return response;
  };

  CreateBillItems = async (body: Bill, user?: IUser) => {
    const config: AxiosRequestConfig = {
      method: 'post',
      url: `/api/bill`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
        'Content-Type': 'application/json',
      },
      data: body,
    };
    const response = await axios(config);
    return response;
  };

  getVendorProductBill = async (productId: number, user: IUser) => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: `/api/bill/vendor/${productId}/products/history`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
      },
    };
    const response = await axios(config);
    return response;
  };

  getVendorProductHistory = async (
    vendorId: number,
    productId: number,
    user: IUser,
  ) => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: `/api/vendor/${vendorId}/product/${productId}/history`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
      },
    };
    const response = await axios(config);
    return response;
  };

  SearchBill = async (search: string, user: IUser) => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: `/api/bill/?date=${search}`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
      },
    };
    const response = await axios(config);
    return response;
  };

  CountBill = async (search: string, user: IUser) => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: '/api/bill/count',
      headers: {
        Authorization: 'Bearer ' + user?.key,
      },
    };
    const response = await axios(config);
    return response;
  };

  UpdateBill = async (
    data: IUpdateBillWithBillItems,
    pid: string | string[] | undefined,
    user: IUser,
  ) => {
    const config: AxiosRequestConfig = {
      method: 'PUT',
      url: `/api/bill/${pid}`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(data),
    };
    const response = await axios(config);
    return response;
  };

  BillDelete = async (id: number | undefined | string, user?: IUser) => {
    const config: AxiosRequestConfig = {
      method: 'delete',
      url: `/api/bill/${id}`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
        'Content-Type': 'application/json',
      },
    };
    const response = await toast.promise(axios(config), {
      pending: 'Deleting....',
      success: 'Bill Deleted',
    });
    return response;
  };

  BillItemDelete = async (
    billId: any,
    id: number | undefined | string,
    user?: IUser,
  ) => {
    const config: AxiosRequestConfig = {
      method: 'delete',
      url: `/api/bill/${billId}/billItems/${id}`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
        'Content-Type': 'application/json',
      },
    };
    const response = await toast.promise(axios(config), {
      pending: 'Deleting....',
      success: 'Bill Item Deleted Successfully',
    });
    return response;
  };
}
