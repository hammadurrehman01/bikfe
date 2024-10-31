import axios, { AxiosRequestConfig } from 'axios';
import { downloadExcel } from 'helpers/helper';
import {
  IInvoice,
  IInvoiceWithInvoiceItems,
  IUpdateInvoiceWithInvoiceItems,
} from 'interface/invoice';
import { IUser } from 'interface/user';
import { toast } from 'react-toastify';

export default class InvoiceService {
  InvoiceDownload = async (invoiceId: string, user: IUser, name: string) => {
    const config: AxiosRequestConfig = {
      method: 'get',
      url: `/api/invoice/downloadExcel/${invoiceId}`,
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

  InvoiceCount = async (user: IUser) => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: `/api/invoice/count`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
      },
    };
    const response = await axios(config);
    return response;
  };

  GetInvoice = async (
    invoiceId: string | string[] | undefined,
    user: IUser,
  ) => {
    const config: AxiosRequestConfig = {
      method: 'get',
      url: `/api/invoice/${invoiceId}`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
      },
    };
    const response = await axios(config);
    return response;
  };

  DeleteInvoiceItem = async (
    invoiceId: string | string[] | undefined,
    invoiceItemId: any,
    user: IUser,
  ) => {
    const config: AxiosRequestConfig = {
      method: 'get',
      url: `/api/invoice/${invoiceId}/invoiceItems/${invoiceItemId}`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
      },
    };
    const response = await axios(config);
    return response;
  };

  ListInvoice = async (
    user: IUser,
    page: number,
    search?: string,
    companyName?: string,
  ) => {
    let url = `/api/invoice?page=${page}`;
    if (search) url += `&date=${search}`;
    if (companyName) url += `&company=${companyName}`;
    const config: AxiosRequestConfig = {
      method: 'get',
      url,
      headers: {
        Authorization: 'Bearer ' + user?.key,
      },
    };
    const response = await axios(config);
    return response;
  };

  CreateInvoice = async (body: IInvoiceWithInvoiceItems, user?: IUser) => {
    const config: AxiosRequestConfig = {
      method: 'post',
      url: `/api/invoice`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
        'Content-Type': 'application/json',
      },
      data: body,
    };
    const response = await axios(config);
    return response;
  };

  CreateInvoiceItem = async (
    data: IInvoice,
    invoiceId: number,
    user?: IUser,
  ) => {
    const config: AxiosRequestConfig = {
      method: 'post',
      url: `/api/invoice/${invoiceId}/invoiceItems`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(data),
    };
    const response = await axios(config);
    return response;
  };

  getVendorProductInvoice = async (productId: number, user: IUser) => {
    const config: AxiosRequestConfig = {
      method: 'get',
      url: `/api/bills/vendor/${productId}/products/history`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
      },
    };
    const response = await axios(config);
    return response;
  };

  getCustomerProductHistory = async (
    customerId: number,
    productId: number,
    user: IUser,
  ) => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: `/api/customer/${customerId}/product/${productId}/history`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
      },
    };
    const response = await axios(config);
    return response;
  };

  SearchInvoice = async (search: string, user: IUser) => {
    const config: AxiosRequestConfig = {
      method: 'get',
      url: `/api/invoice?date=${search}`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
      },
    };
    const response = await axios(config);
    return response;
  };

  updateInvoice = async (
    data: IUpdateInvoiceWithInvoiceItems,
    invoiceId: number | string,
    user: IUser,
  ) => {
    const config: AxiosRequestConfig = {
      method: 'PUT',
      url: `/api/invoice/${invoiceId}`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(data),
    };
    const response = await axios(config);
    return response;
  };

  InvoiceDelete = async (id: number | undefined | string, user?: IUser) => {
    const config: AxiosRequestConfig = {
      method: 'delete',
      url: `/api/invoice/${id}`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
        'Content-Type': 'application/json',
      },
    };
    const response = await toast.promise(axios(config), {
      pending: 'Deleting....',
      success: 'Invoice Deleted',
    });
    return response;
  };

  InvoiceItemDelete = async (
    invoiceId: any,
    id: number | undefined | string,
    user?: IUser,
  ) => {
    const config: AxiosRequestConfig = {
      method: 'delete',
      url: `/api/invoice/${invoiceId}/invoiceItems/${id}`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
        'Content-Type': 'application/json',
      },
    };
    const response = await toast.promise(axios(config), {
      pending: 'Deleting....',
      success: 'Invoice Item Deleted Successfully',
    });
    return response;
  };
}
