import axios, { AxiosRequestConfig } from 'axios';
import { CreateProductInput, IProductInput } from 'interface/product';
import { IUser } from 'interface/user';
import { toast } from 'react-toastify';

export default class ProductService {
  ListProduct = async (page: number, user: IUser, search?: string) => {
    let url = `/api/products?page=${page}`;
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

  SearchProduct = async (search: string, user: IUser) => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: `/api/products?q=${search}&limit=10`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
      },
    };
    const response = await axios(config);
    return response;
  };
  ProductCount = async (user: IUser) => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: `/api/products/count`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
      },
    };
    const response = await axios(config);
    return response;
  };

  CreateProduct = async (data: IProductInput, user?: IUser) => {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: `/api/products`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
        'Content-Type': 'application/json',
      },
      data: data,
    };
    const response = await axios(config);
    return response;
  };
  CreateProductBulk = async (data: any, user?: IUser) => {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: `/api/products/bulk`,
      maxBodyLength: Infinity,
      headers: {
        Authorization: 'Bearer ' + user?.key,
      },
      data: data,
    };
    const response = await axios(config);
    return response;
  };

  ProductDelete = async (id: number | string | undefined, user?: IUser) => {
    const config: AxiosRequestConfig = {
      method: 'DELETE',
      url: `/api/products/${id}`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
        'Content-Type': 'application/json',
      },
    };
    const response = await toast.promise(axios(config), {
      pending: 'Deleting....',
      success: 'Product Deleted',
    });
    return response;
  };

  GetProductById = async (pid: string | string[] | undefined, user: IUser) => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: `/api/products/${pid}`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
      },
    };
    const response = await axios(config);
    return response;
  };

  getVendorProductsByProductId = async (pid: number, user: IUser) => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: `/api/vendor/product/${pid}`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
      },
    };
    const response = await axios(config);
    return response;
  };

  UpdateProduct = async (
    data: CreateProductInput,
    pid: string | string[] | undefined,
    user?: IUser,
  ) => {
    const config: AxiosRequestConfig = {
      method: 'PUT',
      url: `/api/products/${pid}`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
        'Content-Type': 'application/json',
      },
      data: data,
    };
    const response = await axios(config);
    return response;
  };
}
