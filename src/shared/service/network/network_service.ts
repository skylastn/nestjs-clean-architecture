import { Injectable } from '@nestjs/common';
import axios, { Method } from 'axios';
import { ResponseModel } from '../../model/response/response_model';

@Injectable()
export class NetworkService {
  constructor(
    private readonly baseUrl: string,
    private readonly accessToken?: string | null,
  ) {}

  private async request(
    method: Method,
    path: string,
    data?: any,
    params?: any,
    responseType: any = 'json',
  ): Promise<ResponseModel> {
    const endpoint = `${this.baseUrl}/${path}`;

    const config: any = {
      method,
      url: endpoint,
      data,
      params,
      responseType,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };

    if (this.accessToken) {
      config.headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    try {
      const res = await axios(config);
      if (res.status === 200) {
        return ResponseModel.from(res);
      }

      const result = new ResponseModel();
      result.message = res.data.message ?? res.statusText ?? 'Error';
      result.status = false;
      result.data = res.data;
      return result;
    } catch (error: any) {
      const result = new ResponseModel();
      result.message = error?.message ?? 'Request failed';
      result.status = false;
      result.data = error?.response?.data;
      return result;
    }
  }

  // Wrapper methods
  get(path: string, params?: any, responseType: any = 'json') {
    return this.request('GET', path, null, params, responseType);
  }

  post(path: string, data?: any, responseType: any = 'json') {
    return this.request('POST', path, data, null, responseType);
  }

  patch(path: string, data?: any, responseType: any = 'json') {
    return this.request('PATCH', path, data, null, responseType);
  }

  put(path: string, data?: any, responseType: any = 'json') {
    return this.request('PUT', path, data, null, responseType);
  }

  delete(path: string, data?: any, responseType: any = 'json') {
    return this.request('DELETE', path, data, null, responseType);
  }
}
