import { BACKEND_HOST_LOCAL, BACKEND_HOST_PROD } from '@/constants';
import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { message } from 'antd';

// 与后端约定的响应数据格式
interface ResponseStructure {
  success: boolean;
  data: any;
  errorCode?: number;
  errorMessage?: string;
}

const isDev = process.env.NODE_ENV === 'development';

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const requestConfig: RequestConfig = {
  baseURL: isDev ? BACKEND_HOST_LOCAL : BACKEND_HOST_PROD,
  withCredentials: true,

  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      // 拦截请求配置，进行个性化处理。
      const headers = {};
      const tokenName = localStorage.getItem('tokenName');
      const tokenValue = localStorage.getItem('tokenValue');
      if (tokenName && tokenValue) {
        // @ts-ignore
        headers[tokenName] = tokenValue as any;
      }
      config.headers = headers;
      return config;
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      // 请求地址
      const requestPath: string = response.config.url ?? '';

      // 响应
      const { data } = response as unknown as ResponseStructure;
      if (!data) {
        message.error('服务异常');
        // throw new Error('服务异常');
      }

      // 错误码处理
      const code: number = data.code;
      // 未登录，且不为获取用户登录信息接口
      if (
        (code === 40100 || code === 50001) &&
        !requestPath.includes('user/get/login') &&
        !location.pathname.includes('/user/login')
      ) {
        // 跳转至登录页
        window.location.href = `/user/login?redirect=${window.location.href}`;
        throw new Error('请先登录');
      }

      if (code !== 0) {
        message.error(data.message);
      }
      return response;
    },
  ],
};
