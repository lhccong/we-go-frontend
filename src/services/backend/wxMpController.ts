// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 检查 GET /api/ */
export async function checkUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.checkUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<string>('/api/', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 接收消息 POST /api/ */
export async function receiveMessageUsingPost(options?: { [key: string]: any }) {
  return request<any>('/api/', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 设置公众号菜单 GET /api/setMenu */
export async function setMenuUsingGet(options?: { [key: string]: any }) {
  return request<string>('/api/setMenu', {
    method: 'GET',
    ...(options || {}),
  });
}
