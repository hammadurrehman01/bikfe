import axios, { AxiosRequestConfig } from 'axios';
import {
  ICustomer,
  ICustomerAddress,
  ICustomerMapping,
  ICustomerPhone,
} from 'interface/customer';
import { IUser } from 'interface/user';
import { toast } from 'react-toastify';

export default class CustomerService {
  CreateCustomer = async (body: ICustomer, user?: IUser) => {
    const config: AxiosRequestConfig = {
      method: 'post',
      url: `/api/customer`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
        'Content-Type': 'application/json',
      },
      data: body,
    };
    const response = await toast.promise(axios(config), {
      pending: 'Adding Customer....',
      success: 'Customer Added Successfully',
    });

    return response.data;
  };

  CustomerList = async (user: IUser, page: number, search?: string) => {
    let url = `/api/customer?page=${page}`;
    if (search) url += `&q=${search}`;
    const config: AxiosRequestConfig = {
      method: 'get',
      url,
      headers: {
        Authorization: 'Bearer ' + user?.key,
      },
    };
    const { data } = await axios(config);
    return { data };
  };

  GetCustomer = async (pid: string | string[] | undefined, user: IUser) => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: `/api/customer/${pid}`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
      },
    };
    const response = await axios(config);
    return response;
  };

  GetCustomerInvoice = async (
    user: IUser,
    id: string | string[] | undefined,
    page: number,
    search?: string,
  ) => {
    let url = `/api/invoice/customer/${id}?page=${page}`;
    if (search) url += `&search=${search}`;

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
  SearchCustomer = async (search: string, user: IUser) => {
    const config: AxiosRequestConfig = {
      method: 'get',
      url: `/api/customer?q=${search}&limit=10`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
      },
    };
    const response = await axios(config);
    return response;
  };

  UpdateCustomer = async (
    body: ICustomer,
    pid: string | string[],
    user?: IUser,
  ) => {
    const config: AxiosRequestConfig = {
      method: 'PUT',
      url: `/api/customer/${pid}`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
        'Content-Type': 'application/json',
      },
      data: body,
    };
    const response = await axios(config);
    return response;
  };

  CreateCustomerMapping = async (
    customerId: number | string,
    body: ICustomerMapping,
    user?: IUser,
  ) => {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: `/api/customer/${customerId}/customerProduct`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
        'Content-Type': 'application/json',
      },
      data: body,
    };
    const response = await axios(config);
    return response;
  };

  CreateCustomerPhoneAxios = async (
    body: ICustomerPhone,
    pid: string | string[] | undefined,
    user?: IUser,
  ) => {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: `/api/customer/${pid}/phone`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
        'Content-Type': 'application/json',
      },
      data: body,
    };

    const response = await axios(config);
    return response;
  };

  UpdateCustomerPhoneAxios = async (
    body: ICustomerPhone,
    pid: string | string[] | undefined,
    id: string | number,
    user?: IUser,
  ) => {
    const config: AxiosRequestConfig = {
      method: 'PUT',
      url: `/api/customer/${pid}/phone/${id}`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
        'Content-Type': 'application/json',
      },
      data: body,
    };

    const response = await axios(config);
    return response;
  };

  CreateCustomerAddressAxios = async (
    body: ICustomerAddress,
    pid: string | string[] | undefined,
    user?: IUser,
  ) => {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: `/api/customer/${pid}/address`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
        'Content-Type': 'application/json',
      },
      data: body,
    };

    const response = await axios(config);
    return response;
  };

  UpdateCustomerAddressAxios = async (
    body: ICustomerAddress,
    pid: string | string[] | undefined,
    id: string | number,
    user?: IUser,
  ) => {
    const config: AxiosRequestConfig = {
      method: 'PUT',
      url: `/api/customer/${pid}/address/${id}`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
        'Content-Type': 'application/json',
      },
      data: body,
    };

    const response = await axios(config);
    return response;
  };

  UpdateCustomerProduct = async (
    user: IUser,
    customerProductId: string | number,
    code: string,
    pid?: string | string[],
  ) => {
    const config: AxiosRequestConfig = {
      method: 'PUT',
      url: `/api/customer/${pid}/customerProduct/${customerProductId}`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
        'Content-Type': 'application/json',
      },
      data: { code },
    };
    const response = await axios(config);
    return response;
  };

  SearchCustomerProduct = async (
    id: string | string[] | undefined,
    search: string,
    user: IUser,
  ) => {
    const config: AxiosRequestConfig = {
      method: 'get',
      url: `/api/customerProduct/vendor/${id}?code=${search}`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
      },
    };
    const response = await axios(config);
    return response;
  };

  GetCustomerProduct = async (
    user: IUser,
    id: string | string[] | undefined,
    page: number,
    search?: string,
  ) => {
    let url = `/api/customer/${id}/product?page=${page}`;
    if (search) url += `&search=${search}`;

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

  CustomerProductDelete = async (
    id: string | number | undefined,
    user?: IUser,
  ) => {
    const config: AxiosRequestConfig = {
      method: 'delete',
      url: `/api/customerProduct/${id}`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
        'Content-Type': 'application/json',
      },
    };
    const response = await toast.promise(axios(config), {
      pending: 'Deleting....',
      success: 'Customer Product Deleted',
    });
    return response;
  };

  CustomerPhoneDeleteAxios = async (
    pid: string | string[] | undefined,
    id: string | number | undefined,
    user?: IUser,
  ) => {
    const config: AxiosRequestConfig = {
      method: 'delete',
      url: `/api/customer/${pid}/phone/${id}`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
        'Content-Type': 'application/json',
      },
    };
    const response = await toast.promise(axios(config), {
      pending: 'Deleting....',
      success: 'Phone Deleted',
    });
    return response;
  };

  CustomerAddressDeleteAxios = async (
    pid: string | string[] | undefined,
    id: string | number | undefined,
    user?: IUser,
  ) => {
    const config: AxiosRequestConfig = {
      method: 'delete',
      url: `/api/customer/${pid}/address/${id}`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
        'Content-Type': 'application/json',
      },
    };
    const response = await toast.promise(axios(config), {
      pending: 'Deleting....',
      success: 'Address Deleted',
    });
    return response;
  };

  ListCustomerBill = async (
    user: IUser,
    id: string,
    page: number,
    search?: string,
  ) => {
    let url = `/api/invoice/customer/${id}?page=${page}`;
    if (search) url += `&q=${search}`;

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

  CustomerCount = async (user: IUser) => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: `/api/customer/count`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
      },
    };
    const response = await axios(config);
    return response;
  };

  SearchCustomerBill = async (id: number, search: string, user: IUser) => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: `/api/invoice/customer/${id}?date=${search}`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
      },
    };
    const response = await axios(config);
    return response;
  };

  GetCustomerMappingCode = async (
    customerId: number,
    productId: number,
    user: IUser,
  ) => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: `/api/customer/${customerId}/product/${productId}`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
      },
    };
    const response = await axios(config);
    return response;
  };

  searchCurrency = async (search: string, user: IUser) => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: `/api/currency/list/?q=${search}`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
      },
    };
    const response = await axios(config);
    return response;
  };

  GetCustomerPhone = async (
    pid: string | string[] | undefined,
    user: IUser,
  ) => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: `/api/customer/${pid}/phone`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
      },
    };
    const response = await axios(config);
    return response;
  };

  GetCustomerAddress = async (
    pid: string | string[] | undefined,
    user: IUser,
  ) => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: `/api/customer/${pid}/address`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
      },
    };
    const response = await axios(config);
    return response;
  };
}
