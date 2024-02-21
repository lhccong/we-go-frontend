declare namespace API {
  type Badge = {
    /** 徽章说明 */
    describe?: string;
    /** 徽章图像 */
    img?: string;
  };

  type BaseResponseBoolean_ = {
    code?: number;
    data?: boolean;
    message?: string;
  };

  type BaseResponseLoginUserVO_ = {
    code?: number;
    data?: LoginUserVO;
    message?: string;
  };

  type BaseResponseLong_ = {
    code?: number;
    data?: string;
    message?: string;
  };

  type BaseResponsePageChatMessageResp_ = {
    code?: number;
    data?: PageChatMessageResp_;
    message?: string;
  };

  type BaseResponsePageRoomVo_ = {
    code?: number;
    data?: PageRoomVo_;
    message?: string;
  };

  type BaseResponsePageUser_ = {
    code?: number;
    data?: PageUser_;
    message?: string;
  };

  type BaseResponsePageUserVO_ = {
    code?: number;
    data?: PageUserVO_;
    message?: string;
  };

  type BaseResponseString_ = {
    code?: number;
    data?: string;
    message?: string;
  };

  type BaseResponseTokenLoginUserVo_ = {
    code?: number;
    data?: TokenLoginUserVo;
    message?: string;
  };

  type BaseResponseUser_ = {
    code?: number;
    data?: User;
    message?: string;
  };

  type BaseResponseUserVO_ = {
    code?: number;
    data?: UserVO;
    message?: string;
  };

  type ChatMessageResp = {
    fromUser?: UserInfo;
    message?: Message;
    /** 房间id */
    roomId?: string;
  };

  type checkUsingGETParams = {
    /** echostr */
    echostr?: string;
    /** nonce */
    nonce?: string;
    /** signature */
    signature?: string;
    /** timestamp */
    timestamp?: string;
  };

  type DeleteRequest = {
    id?: string;
  };

  type getUserByIdUsingGETParams = {
    /** id */
    id?: string;
  };

  type getUserVoByIdUsingGETParams = {
    /** id */
    id?: string;
  };

  type LoginUserVO = {
    createTime?: string;
    friendNum?: number;
    groupNum?: number;
    id?: string;
    level?: number;
    updateTime?: string;
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type Message = {
    /** 消息内容 */
    content?: string;
    /** 消息id */
    id?: string;
    messageMark?: MessageMark;
    reply?: ReplyMsg;
    /** 消息发送时间 */
    sendTime?: string;
    /** 消息类型 1正常文本 2.爆赞 （点赞超过10）3.危险发言（举报超5） */
    type?: number;
    /** 消息链接映射 */
    urlTitleMap?: Record<string, any>;
  };

  type MessageMark = {
    /** 举报数 */
    dislikeCount?: number;
    /** 点赞数 */
    likeCount?: number;
    /** 该用户是否已经举报 0否 1是 */
    userDislike?: number;
    /** 该用户是否已经点赞 0否 1是 */
    userLike?: number;
  };

  type MessageQueryRequest = {
    current?: number;
    pageSize?: number;
    roomId?: string;
    sortField?: string;
    sortOrder?: string;
  };

  type OrderItem = {
    asc?: boolean;
    column?: string;
  };

  type PageChatMessageResp_ = {
    countId?: string;
    current?: string;
    maxLimit?: string;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: string;
    records?: ChatMessageResp[];
    searchCount?: boolean;
    size?: string;
    total?: string;
  };

  type PageRoomVo_ = {
    countId?: string;
    current?: string;
    maxLimit?: string;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: string;
    records?: RoomVo[];
    searchCount?: boolean;
    size?: string;
    total?: string;
  };

  type PageUser_ = {
    countId?: string;
    current?: string;
    maxLimit?: string;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: string;
    records?: User[];
    searchCount?: boolean;
    size?: string;
    total?: string;
  };

  type PageUserVO_ = {
    countId?: string;
    current?: string;
    maxLimit?: string;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: string;
    records?: UserVO[];
    searchCount?: boolean;
    size?: string;
    total?: string;
  };

  type ReplyMsg = {
    /** 是否可消息跳转 0否 1是 */
    canCallback?: number;
    /** 消息内容 */
    content?: string;
    /** 跳转间隔的消息条数 */
    gapCount?: number;
    /** 消息id */
    id?: string;
    /** 用户名称 */
    username?: string;
  };

  type RoomQueryRequest = {
    current?: number;
    pageSize?: number;
    roomId?: string;
    sortField?: string;
    sortOrder?: string;
  };

  type RoomVo = {
    activeTime?: string;
    avatar?: string;
    content?: string;
    id?: string;
    roomName?: string;
    type?: number;
    unreadNum?: number;
    userId?: string;
  };

  type SaTokenInfo = {
    isLogin?: boolean;
    loginDevice?: string;
    loginId?: Record<string, any>;
    loginType?: string;
    sessionTimeout?: string;
    tag?: string;
    tokenActiveTimeout?: string;
    tokenName?: string;
    tokenSessionTimeout?: string;
    tokenTimeout?: string;
    tokenValue?: string;
  };

  type TokenLoginUserVo = {
    createTime?: string;
    friendNum?: number;
    groupNum?: number;
    id?: string;
    level?: number;
    saTokenInfo?: SaTokenInfo;
    updateTime?: string;
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type uploadFileUsingPOSTParams = {
    biz?: string;
  };

  type User = {
    createTime?: string;
    friendNum?: number;
    groupNum?: number;
    id?: string;
    isDelete?: number;
    level?: number;
    mpOpenId?: string;
    unionId?: string;
    updateTime?: string;
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userPassword?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UserAddRequest = {
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userRole?: string;
  };

  type UserInfo = {
    /** 头像 */
    avatar?: string;
    badge?: Badge;
    /** 归属地 */
    locPlace?: string;
    /** 用户id */
    uid?: string;
    /** 用户名称 */
    username?: string;
  };

  type userLoginByWxOpenUsingGETParams = {
    /** code */
    code: string;
  };

  type UserLoginRequest = {
    userAccount?: string;
    userPassword?: string;
  };

  type UserQueryRequest = {
    current?: number;
    id?: string;
    mpOpenId?: string;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    unionId?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UserRegisterRequest = {
    checkPassword?: string;
    userAccount?: string;
    userPassword?: string;
  };

  type UserUpdateMyRequest = {
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
  };

  type UserUpdateRequest = {
    id?: string;
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UserVO = {
    createTime?: string;
    friendNum?: number;
    groupNum?: number;
    id?: string;
    level?: number;
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };
}
