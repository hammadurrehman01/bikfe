import axios, { AxiosRequestConfig } from 'axios';
import { IUser } from 'interface/user';
import {
  IVendor,
  IVendorAddress,
  IVendorMapping,
  IVendorPhone,
} from 'interface/vendor';
import { toast } from 'react-toastify';

export default class VendorService {
  VendorCount = async (user: IUser) => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: `/api/vendor/count`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
      },
    };
    const response = await axios(config);
    return response;
  };

  CreateVendorBulk = async (data: any, user?: IUser) => {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: `/api/vendor/bulkvendors`,
      maxBodyLength: Infinity,
      headers: {
        Authorization: 'Bearer ' + user?.key,
      },
      data: data,
    };
    const response = await axios(config);
    return response;
  };

  CreateVendor = async (body: IVendor, user?: IUser) => {
    const config: AxiosRequestConfig = {
      method: 'post',
      url: `/api/vendor`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
        'Content-Type': 'application/json',
      },
      data: body,
    };
    const response = await toast.promise(axios(config), {
      pending: 'Adding Vendor....',
      success: 'Vendor Added Successfully',
    });
    return response.data;
  };

  CreateVendorPhone = async (
    body: IVendorPhone,
    pid: string | string[] | undefined,
    user?: IUser,
  ) => {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: `/api/vendor/${pid}/phone`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
        'Content-Type': 'application/json',
      },
      data: body,
    };

    const response = await axios(config);
    return response;
  };

  CreateVendorAddress = async (
    body: IVendorAddress,
    pid: string | string[] | undefined,
    user?: IUser,
  ) => {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: `/api/vendor/${pid}/address`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
        'Content-Type': 'application/json',
      },
      data: body,
    };

    const response = await axios(config);
    return response;
  };

  ListVendor = async (user: IUser, page?: number, search?: string) => {
    let url = `/api/vendor?page=${page}`;
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

  GetVendorById = async (pid: string | string[] | undefined, user: IUser) => {
    const config: AxiosRequestConfig = {
      method: 'get',
      url: `/api/vendor/${pid}`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
      },
    };
    const response = await axios(config);
    return response;
  };

  SearchVendor = async (search: string, user: IUser) => {
    const config: AxiosRequestConfig = {
      method: 'get',
      url: `/api/vendor?q=${search}&limit=10`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
      },
    };
    const response = await axios(config);
    return response;
  };

  UpdateVendor = async (
    body: IVendor,
    pid: string | string[] | undefined,
    user?: IUser,
  ) => {
    const config: AxiosRequestConfig = {
      method: 'PUT',
      url: `/api/vendor/${pid}`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
        'Content-Type': 'application/json',
      },
      data: body,
    };
    const response = await axios(config);
    return response;
  };

  UpdateVendorAddressAxios = async (
    body: IVendorAddress,
    pid: string | string[] | undefined,
    id: string | number,
    user?: IUser,
  ) => {
    const config: AxiosRequestConfig = {
      method: 'PUT',
      url: `/api/vendor/${pid}/address/${id}`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
        'Content-Type': 'application/json',
      },
      data: body,
    };

    const response = await axios(config);
    return response;
  };

  UpdateVendorPhoneAxios = async (
    body: IVendorPhone,
    pid: string | string[] | undefined,
    id: string | number,
    user?: IUser,
  ) => {
    const config: AxiosRequestConfig = {
      method: 'PUT',
      url: `/api/vendor/${pid}/phone/${id}`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
        'Content-Type': 'application/json',
      },
      data: body,
    };

    const response = await axios(config);
    return response;
  };

  CreateVendorMapping = async (
    vendorId: string | number,
    body: IVendorMapping,
    user?: IUser,
  ) => {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: `/api/vendor/${vendorId}/vendorProduct`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
        'Content-Type': 'application/json',
      },
      data: body,
    };
    const response = await axios(config);
    return response;
  };

  // UpdateVendorProduct = async (
  //   user: IUser,
  //   customerProductId: string | number,
  //   code: string,
  // ) => {
  //   const config: AxiosRequestConfig = {
  //     method: 'PUT',
  //     url: `/api/vendor/${vendorId}/vendorProduct/${customerProductId}`,
  //     headers: {
  //       Authorization: 'Bearer ' + user?.key,
  //       'Content-Type': 'application/json',
  //     },
  //     data: { code },
  //   };
  //   const response = await axios(config);
  //   return response;
  // };

  SearchvendorProduct = async (
    id: string | string[] | undefined,
    search: string,
    user: IUser,
  ) => {
    const config: AxiosRequestConfig = {
      method: 'get',
      url: `/api/vendorProduct/vendor/${id}?code=${search}`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
      },
    };
    const response = await axios(config);
    return response;
  };

  GetvendorProduct = async (
    user: IUser,
    pid: string | string[] | undefined,
    page: number,
    search?: string,
  ) => {
    let url = `/api/vendor/${pid}/vendorProduct?page=${page}`;
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

  vendorProductDelete = async (
    id: string | number | undefined,
    user?: IUser,
  ) => {
    const config: AxiosRequestConfig = {
      method: 'delete',
      url: `/api/vendorProduct/${id}`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
        'Content-Type': 'application/json',
      },
    };
    const response = await toast.promise(axios(config), {
      pending: 'Deleting....',
      success: 'Vendor Product Deleted',
    });
    return response;
  };

  VendorPhoneDelete = async (
    pid: string | string[] | undefined,
    id: string | number | undefined,
    user?: IUser,
  ) => {
    const config: AxiosRequestConfig = {
      method: 'delete',
      url: `/api/vendor/${pid}/phone/${id}`,
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

  VendorAddressDelete = async (
    pid: string | string[] | undefined,
    id: string | number | undefined,
    user?: IUser,
  ) => {
    const config: AxiosRequestConfig = {
      method: 'delete',
      url: `/api/vendor/${pid}/address/${id}`,
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

  ListVendorBill = async (
    user: IUser,
    id: string,
    page: number,
    search?: string,
  ) => {
    let url = `/api/bill/vendor/${id}?page=${page}`;
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

  SearchVendorBill = async (id: number, search: string, user: IUser) => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: `/api/bill/vendor/${id}?date=${search}`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
      },
    };
    const response = await axios(config);
    return response;
  };

  GetVendorMappingCode = async (
    vendorId: string | number,
    productId: string | number,
    user: IUser,
  ) => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: `/api/vendor/${vendorId}/product/${productId}`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
      },
    };
    const response = await axios(config);
    return response;
  };

  // CreateVendorMappingCode = async (
  //   code: number | string,
  //   productId: number | undefined,
  //   vendorId: number | undefined,
  //   user: IUser,
  // ) => {
  //   const config: AxiosRequestConfig = {
  //     method: 'POST',
  //     url: `/api/vendor/${vendorId}/vendorproduct/${productId}`,
  //     headers: {
  //       Authorization: 'Bearer ' + user?.key,
  //     },
  //   };
  //   const response = await axios(config);
  //   return response;
  // };

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

  GetVendorPhone = async (pid: string | string[] | undefined, user: IUser) => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: `/api/vendor/${pid}/phone`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
      },
    };
    const response = await axios(config);
    return response;
  };

  GetVendorAddress = async (
    pid: string | string[] | undefined,
    user: IUser,
  ) => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: `/api/vendor/${pid}/address`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
      },
    };
    const response = await axios(config);
    return response;
  };
}
