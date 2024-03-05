// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取好友列表 POST /api/chat/friend/list/vo */
export async function listFriendContentVoUsingPost(options?: { [key: string]: any }) {
  return request<API.BaseResponseListFriendContentVo_>('/api/chat/friend/list/vo', {
    method: 'POST',
    ...(options || {}),
  });
}

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

/** 分页获取用户房间消息列表 POST /api/chat/message/page/vo */
export async function listMessageVoByPageUsingPost(
  body: API.MessageQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageChatMessageResp_>('/api/chat/message/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取群聊或者用户信息 POST /api/chat/search/friend/vo */
export async function searchFriendVoUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.searchFriendVoUsingPOSTParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseAddFriendVo_>('/api/chat/search/friend/vo', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
