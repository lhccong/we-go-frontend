declare namespace API {
  type Chat = {
    type?: number;
    uid?: number;
    data?: any;
  }
  type FriendMessage = {
    avatarUrl?: string;
    type?: number;
    numberId?: string;
    area?: string;
    userName?: string;
    status?: string;
    alias?: string;
    signature?: string;
  }
}
