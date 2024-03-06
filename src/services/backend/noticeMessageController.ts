// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 添加好友通知请求 POST /api/notice/add/friend */
export async function addFriendUsingPost(
  body: API.FriendAddRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/api/notice/add/friend', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取消息列表 GET /api/notice/messageNotice/list */
export async function getMessageNoticeListUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseListNoticeMessageVo_>('/api/notice/messageNotice/list', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取消息数量 GET /api/notice/messageNum */
export async function getMessageNumUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseMessageNumVo_>('/api/notice/messageNum', {
    method: 'GET',
    ...(options || {}),
  });
}

/** SSE连接请求 GET /api/notice/userConnect */
export async function connectUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.connectUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.SseEmitter>('/api/notice/userConnect', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
