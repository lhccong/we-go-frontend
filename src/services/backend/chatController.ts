// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 分页获取用户房间会话列表 POST /api/chat/list/page/vo */
export async function listRoomVoByPageUsingPost(
  body: API.RoomQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageRoomVo_>('/api/chat/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
