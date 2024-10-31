import axios, { AxiosRequestConfig } from 'axios';
import { NEXT_PUBLIC_SECRET_KEY } from 'config/environments';
import { IUser } from 'interface/user';

export default class AuthService {
  HandleSignin = async (data: IUser) => {
    const config: AxiosRequestConfig = {
      method: 'post',
      url: `/api/auth/signin`,
      headers: {
        'Content-Type': 'application/json',
        'secret-key': NEXT_PUBLIC_SECRET_KEY,
      },
      data: JSON.stringify(data),
    };
    const response = await axios(config);
    return response.data;
  };
  HandleLogout = async (user: IUser) => {
    const config: AxiosRequestConfig = {
      method: 'post',
      url: `/api/users/auth/logout/`,
      headers: {
        Authorization: 'Bearer ' + user?.key,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
    const response = await axios(config);
    return response;
  };
}
