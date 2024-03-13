import { AvatarDropdown } from '@/components/RightContent/AvatarDropdown';
import {BACKEND_HOST_LOCAL} from '@/constants';
import {
  listFriendContentVoUsingPost,
  listMessageVoByPageUsingPost,
  listRoomVoByPageUsingPost,
  searchFriendVoUsingPost,
} from '@/services/backend/chatController';
import {
  addFriendUsingPost,
  getMessageNoticeListUsingGet,
  getMessageNumUsingGet,
  handleMessageNoticeUsingPost,
  readMessageNoticeUsingGet,
} from '@/services/backend/noticeMessageController';
import { getUserVoByIdUsingGet } from '@/services/backend/userController';
import { useModel } from '@@/exports';
import { MessageOutlined, UserOutlined } from '@ant-design/icons';
import {
  Avatar,
  ChatContainer,
  Conversation,
  ConversationHeader,
  ConversationList,
  InfoButton,
  MainContainer,
  Message,
  MessageInput,
  MessageList,
  MessageSeparator,
  Search as ChatSearch,
  Sidebar,
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  faEnvelopeOpenText,
  faMagnifyingGlass,
  faSquareCheck,
  faUserPlus,
  faVolumeHigh,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Badge,
  Card,
  Col,
  Collapse,
  Divider,
  Empty,
  Input,
  List, message,
  Modal,
  Row,
  Skeleton,
  Tabs,
} from 'antd';
import Search from 'antd/es/input/Search';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import UserAddProfile from './User/components/UserAddProfile';
import UserProfile from './User/components/UserProfile';

const Welcome: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRemarkModalOpen, setIsRemarkModalOpen] = useState(false);
  const [msgPageNum, setMsgPageNum] = useState(2);
  const [activeKey, setActiveKey] = useState('1');
  const [initLoaded, setInitLoaded] = useState(false);
  const [msgTotal, setMsgTotal] = useState(0);
  const [messages, setMessages] = useState<API.ChatMessageResp[]>([]);
  const [friendContent, setFriendContent] = useState<API.FriendContentVo[]>([]);
  const msgListRef = useRef(null);
  const { currentUser } = initialState || {};
  const [activeConversation, setActiveConversation] = useState<API.RoomVo>();
  const [messageNum, setMessageNum] = useState<API.MessageNumVo>();
  const [currentSelectUser, setCurrentSelectUser] = useState<API.FriendVo>();
  const [friendMessage, setFriendMessage] = useState<API.FriendMessage>();
  const [addFriendMessage, setAddFriendMessage] = useState<API.AddFriendVo>();
  const [conversations, setConversations] = useState<API.RoomVo[]>([]);
  const [noticeMessages, setNoticeMessages] = useState<API.NoticeMessageVo[]>([]);
  // Set initial message input value to empty string
  const [messageInputValue, setMessageInputValue] = useState('');
  const [total, setTotal] = useState<string>();
  const [remark, setRemark] = useState<string>('我是' + currentUser?.userName);

  const loadMoreData = () => {};

  useEffect(() => {
    getMessageNumUsingGet().then((res) => {
      setMessageNum(res.data);
    });
  }, []);
  useEffect(() => {
    const tokenValue = localStorage.getItem('tokenValue');
    let url = BACKEND_HOST_LOCAL + '/api/notice/userConnect?token=' + tokenValue;
    const eventSource = new EventSource(url);
    setEventSource(eventSource);
    console.log('SSE连接已建立');

    return () => {
      console.log('SSE断开');
      eventSource.close(); // 组件卸载时关闭SSE连接
    };
  }, []); // 空数组表示这个effect只在组件加载时运行一次
  useEffect(() => {
    if (eventSource) {
      const tokenValue = localStorage.getItem('tokenValue');
      let url = BACKEND_HOST_LOCAL + '/api/notice/userConnect?token=' + tokenValue;
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log(data);
        setMessageNum({
          ...messageNum,
          noticeNum: ((Number(messageNum?.noticeNum) || 0) + 1).toString(),
        });
        // 处理数据
      };

      eventSource.onerror = (error) => {
        // 处理连接错误
        console.error('SSE错误:', error);
        eventSource.close();
        // 关闭错误的连接
        eventSource.close();
        // 设置延时尝试重新连接
        setTimeout(() => {
          console.log('重新连接中...');
          // 递归调用以重新初始化SSE连接
          const eventSource = new EventSource(url);
          setEventSource(eventSource);
        }, 5000); // 5秒后重连
      };
    }
  }, [messageNum]);

  useEffect(() => {
    const tokenValue = localStorage.getItem('tokenValue');
    const newSocket = new WebSocket('wss://qingxin.store/ws?token=' + tokenValue);
    setSocket(newSocket);

    // 在组件卸载时关闭WebSocket连接
    return () => {
      newSocket.close();
    };
  }, []);
  useEffect(() => {
    if (socket && currentUser) {
      // 添加WebSocket事件处理程序
      socket.onopen = () => {
        console.log('WebSocket连接已建立');
        //发送建立连接的请求
        const connectCommand = {
          type: 1,
        };
        socket.send(JSON.stringify(connectCommand));
        // 设置定时器，每隔一定时间发送心跳消息
        setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
            // 发送心跳消息，可以是任何你希望的消息，比如 'ping'
            socket.send(JSON.stringify({ type: 4 }));
          }
        }, 10000); // 每10秒发送一次心跳消息
      };
      //接收数据
      socket.onmessage = (event) => {
        const res: API.Chat = JSON.parse(event.data);
        if (res.data && res.type === 2) {
          let target: API.RoomVo | null = null;
          const others: API.RoomVo[] = [];
          const { roomId } = res.data;
          if (activeConversation && roomId === Number(activeConversation.id)) {
            //设置聊天消息
            setMessages([...messages, res.data]);
            //设置左侧栏的消息
            for (const conversation of conversations) {
              if (Number(conversation.id) === roomId) {
                target = { ...conversation, content: res.data.message.content };
              } else {
                others.push(conversation);
              }
            }
          }
          //消息来自其他聊天窗口（或者不属于任何一个聊天窗口）
          else {
            for (const conversation of conversations) {
              if (Number(conversation.id) === Number(roomId)) {
                target = {
                  ...conversation,
                  unreadNum: Number(conversation.unreadNum) + 1,
                  content: res.data.message.content,
                };
              } else {
                others.push(conversation);
              }
            }
            if (!target) {
              const { fromUser, message } = res.data;
              target = {
                id: roomId,
                userId: fromUser.userId,
                roomName: fromUser.name,
                avatar: fromUser.avatar,
                unreadNum: 1,
                content: message.content,
                activeTime: message.activeTime,
              };
            }
          }
          setConversations([target as API.RoomVo, ...others]);
        }
      };
      //关闭连接
      socket.onclose = () => {
        console.log('WebSocket连接已关闭');
      };
      //连接错误
      socket.onerror = (error) => {
        console.error('WebSocket发生错误:', error);
      };
    }
  }, [socket, conversations, messages]);

  useEffect(() => {
    //获取与用户的所有聊天消息
    if (activeConversation && activeConversation.userId) {
      listMessageVoByPageUsingPost({
        pageSize: 30,
        roomId: activeConversation.id,
      }).then((res) => {
        if (res.code === 0) {
          if (res.data?.records) {
            setMessages(res.data?.records);
            setMsgTotal(Number(res.data?.total));
          }
        }
      });
    }
  }, [activeConversation]);
  //消息已读
  const onRead = (id: string | undefined, index: number) => {
    readMessageNoticeUsingGet({ id: id }).then((res) => {
      if (res.data) {
        setMessageNum({
          ...messageNum,
          noticeNum: ((Number(messageNum?.noticeNum) || 0) - 1).toString(),
        });
        setNoticeMessages((prevMessages) => {
          // 创建数组的浅拷贝
          const updatedMessages = [...prevMessages];
          // 如果index有效，则更新对象
          if (index >= 0 && index < updatedMessages.length) {
            // 更新已读
            updatedMessages[index] = { ...updatedMessages[index], readTarget: 1 };
          }
          return updatedMessages;
        });
      }
    });
  };
  const handleMessage = (
    id: string | undefined,
    index: number,
    noticeType: number | undefined,
    processResult: number,
  ) => {
    handleMessageNoticeUsingPost({ id, noticeType, processResult }).then((res) => {
      if (res.code === 0) {
        setNoticeMessages((prevMessages) => {
          // 创建数组的浅拷贝
          const updatedMessages = [...prevMessages];
          // 如果index有效，则更新对象
          if (index >= 0 && index < updatedMessages.length) {
            // 更新结果
            updatedMessages[index] = { ...updatedMessages[index], processResult: res.data };
          }
          return updatedMessages;
        });
      }
    });
  };
  const getFriendDetail = (type: number, item: API.FriendVo) => {
    //群聊详情
    if (Number(type) === 1) {
      const msgVo: API.FriendMessage = {
        userName: item?.name,
        type: type,
        avatarUrl: item?.avatar,
        numberId: item?.roomId + 's',
        alias: '暂无备注',
        signature: '暂无签名',
        area: '中国',
        status: 'none',
      };
      setFriendMessage(msgVo);
    } //好友详情
    else if (Number(type) === 2) {
      getUserVoByIdUsingGet({ id: item.uid }).then((res) => {
        const userVo = res.data;
        const msgVo: API.FriendMessage = {
          userName: userVo?.userName,
          type: type,
          avatarUrl: userVo?.userAvatar,
          numberId: item?.uid,
          alias: '暂无备注',
          signature: '暂无签名',
          area: '中国',
          status: 'online',
        };
        setFriendMessage(msgVo);
      });
    }
  };
  const addFriend = () => {
    // addFriendUsingPost({ userId: id, remark: '你好' }).then((res) => {
    //   console.log(res);
    // });
    setIsRemarkModalOpen(true);
  };
  //发送消息
  const sendMessage = (message: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const command = {
        type: 2,
        userId: activeConversation?.userId,
        data: message,
      };
      socket.send(JSON.stringify(command));
    }
  };
  const changeConversation = (newConversation: API.RoomVo) => {
    if (!activeConversation || newConversation.id !== activeConversation.id) {
      setInitLoaded(false);
      setMsgPageNum(1);
      setActiveConversation({ ...newConversation, unreadNum: 0 });
      setConversations(
        conversations.map((conversation) =>
          Number(conversation.id) === Number(newConversation.id)
            ? { ...newConversation, unreadNum: 0 }
            : conversation,
        ),
      );
    }
    // @ts-ignore
    msgListRef.current?.scrollToBottom();
  };
  // 组件加载时和页码变化时触发数据获取
  useEffect(() => {
    listRoomVoByPageUsingPost({
      pageSize: 100,
      current: 0,
    }).then((res) => {
      if (res.code === 0) {
        // @ts-ignore
        setConversations(res.data?.records);
        setTotal(res.data?.total);
      }
    });
  }, [total]);
  const onYReachStart = () => {
    setInitLoaded(true);
    //防止多次加载
    if (loadingMore) {
      return;
    }
    if (initLoaded && activeConversation && messages.length < msgTotal) {
      setLoadingMore(true);
      const msgPageNumTemp = msgPageNum + 1
      setMsgPageNum(msgPageNumTemp);
      listMessageVoByPageUsingPost({
        current: msgPageNumTemp,
        pageSize: 30,
        roomId: activeConversation.id,
      }).then((res) => {
        if (res.code === 0) {
          if (res.data?.records) {
            setMessages([...res.data?.records, ...messages]);
            setLoadingMore(false);
          }
        }
      });
    }
  };

  const onChange = async (key: string) => {
    if (key === '2') {
      const res = await listFriendContentVoUsingPost();
      if (res.data) {
        setFriendContent(res?.data);
      }
    }
    if (key === '3') {
      const res = await getMessageNoticeListUsingGet();
      if (res.data) {
        setNoticeMessages(res?.data);
      }
    }
    setActiveKey(key);
  };

  const showAddModal = () => {
    setIsAddModalOpen(true);
  };
  //发起好友添加申请
  const handleAddOk = async () => {
    addFriendUsingPost({ userId: addFriendMessage?.uid, remark: remark }).then((res) => {
      if (res.code===0){
        message.success("发送成功");
        setIsRemarkModalOpen(false);
      }
    });
  };

  const handleAddCancel = () => {
    setIsAddModalOpen(false);
  };
  //查找用户或群聊
  const findUserOrGroup = async (value: string) => {
    searchFriendVoUsingPost({ id: value }).then((res) => {
      setAddFriendMessage(res.data);
    });
  };

  return (
    <Tabs
      tabPosition={'left'}
      style={{ height: '100vh' }}
      indicator={{ align: 'center' }}
      activeKey={activeKey}
      onChange={onChange}
      tabBarExtraContent={<AvatarDropdown />}
    >
      <Tabs.TabPane
        style={{ height: '100vh', paddingLeft: '0' }}
        icon={<MessageOutlined style={{ fontSize: '26px' }} />}
        key="1"
      >
        <MainContainer responsive>
          <Sidebar style={{ borderColor: '#DEDDDC' }} position="left" scrollable={false}>
            <ChatSearch placeholder="搜索" />
            <ConversationList>
              {conversations.map((conversation) => (
                <Conversation
                  active={activeConversation && activeConversation.id === conversation.id}
                  onClick={() => changeConversation(conversation)}
                  lastActivityTime={moment(conversation.activeTime).format('MMMDo a h:mm ')}
                  key={conversation.id}
                  name={conversation.roomName}
                  info={conversation.content}
                  unreadCnt={conversation.unreadNum}
                >
                  {conversation.type === 1 ? (
                    <Avatar src={conversation.avatar} />
                  ) : (
                    <Avatar src={conversation.avatar} status="available" />
                  )}
                </Conversation>
              ))}
            </ConversationList>
          </Sidebar>
          {!activeConversation ? (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  backgroundSize: '402px 204px',
                  marginBottom: 32,
                  width: 402,
                  height: 204,
                }}
              />
              <div style={{ color: ' #8896b8', fontSize: 14, lineHeight: '20em' }}>
                <Empty description={'快找小伙伴聊天吧 ( ゜- ゜)つロ'} />.
              </div>
            </div>
          ) : (
            <ChatContainer>
              <ConversationHeader>
                <ConversationHeader.Back />
                <Avatar src={activeConversation.avatar} name={activeConversation.id} />
                <ConversationHeader.Content
                  userName={activeConversation.roomName}
                  info={moment(activeConversation.activeTime).format('MMMDo a h:mm ')}
                />
                <ConversationHeader.Actions>
                  <InfoButton />
                </ConversationHeader.Actions>
              </ConversationHeader>
              <MessageList ref={msgListRef} loadingMore={loadingMore} onYReachStart={onYReachStart}>
                <MessageSeparator content={'上次的聊天'} />
                {messages.map((message, index) => {
                  const flag = message.fromUser?.uid === currentUser?.id;
                  return (
                    <Message
                      style={{ padding: 10 }}
                      key={index}
                      model={{
                        message: message.message?.content,
                        sender: message.fromUser?.username,
                        direction: flag ? 'outgoing' : 'incoming',
                        position: 'single',
                      }}
                      avatarPosition={flag ? 'tr' : 'tl'}
                    >
                      {activeConversation.type === 1 ? (
                        <Message.Header sender={message.fromUser?.username} />
                      ) : (
                        ''
                      )}
                      <Avatar
                        style={{ width: 36, minWidth: 36, height: 36, minHeight: 36 }}
                        src={message.fromUser?.avatar}
                        name={message.fromUser?.username}
                      />
                    </Message>
                  );
                })}
              </MessageList>
              <MessageInput
                placeholder="Type message here"
                value={messageInputValue}
                onChange={(val) => setMessageInputValue(val)}
                onSend={() => {
                  setMessageInputValue('');
                  const msg = {
                    type: activeConversation?.type,
                    toUid: activeConversation?.userId,
                    content: messageInputValue,
                  };
                  const msgVo: API.ChatMessageResp = {
                    fromUser: {
                      uid: currentUser?.id,
                      username: currentUser?.userName,
                      avatar: currentUser?.userAvatar,
                    },
                    message: {
                      content: messageInputValue,
                    },
                  };
                  setMessages([...messages, msgVo]);
                  setConversations([
                    { ...activeConversation, content: messageInputValue },
                    ...conversations.filter(
                      (conversation) => conversation.id !== activeConversation?.id,
                    ),
                  ]);
                  sendMessage(msg);
                }}
              />
            </ChatContainer>
          )}
        </MainContainer>
      </Tabs.TabPane>
      <Tabs.TabPane
        icon={<UserOutlined style={{ fontSize: '26px' }} />}
        style={{ height: '100vh', paddingLeft: '0' }}
        key="2"
      >
        <Modal footer={null} title="添加好友" onCancel={handleAddCancel} open={isAddModalOpen}>
          <Search placeholder="input search text" allowClear onSearch={findUserOrGroup} />
          <Card style={{ marginTop: 10 }}>
            {addFriendMessage ? (
              <>
                <Modal title="申请" open={isRemarkModalOpen} onOk={handleAddOk}>
                  好友申请🔍：
                  <Input value={remark} onChange={(e) => setRemark(e.target.value)} />
                </Modal>
                <UserAddProfile
                  friendMessage={addFriendMessage}
                  onAdd={() => addFriend()}
                  onMessage={() => {
                    let sendMessageTarget = 0;
                    for (let conversation of conversations) {
                      if (conversation.id === addFriendMessage?.roomId) {
                        setActiveConversation(conversation);
                        sendMessageTarget = sendMessageTarget + 1;
                      }
                    }
                    if (sendMessageTarget === 0) {
                      const target: API.RoomVo = {
                        id: addFriendMessage?.roomId,
                        userId: addFriendMessage?.uid,
                        type: addFriendMessage?.type,
                        roomName: addFriendMessage?.name,
                        avatar: addFriendMessage?.avatar,
                      };
                      setActiveConversation(target);
                      setConversations([target, ...conversations]);
                    }
                    setActiveKey('1');
                    setIsAddModalOpen(false);
                  }}
                />
              </>
            ) : (
              <Empty description={'暂无此人o((>ω< ))o'} />
            )}
          </Card>
        </Modal>
        <Row>
          <Col span={4} style={{ borderRight: '1px solid #DEDDDC', height: '100vh' }}>
            <Row>
              <Col span={18} style={{ padding: 10 }}>
                <Input placeholder="搜索" prefix={<FontAwesomeIcon icon={faMagnifyingGlass} />} />
              </Col>
              <Col span={6} style={{ fontSize: '20px', padding: 10 }}>
                <FontAwesomeIcon icon={faUserPlus} onClick={showAddModal} />
              </Col>
            </Row>
            <Collapse bordered={false}>
              {friendContent.map((friend) => (
                <Collapse.Panel key={friend?.typeName + '1'} header={friend?.typeName}>
                  <List
                    itemLayout="horizontal"
                    dataSource={friend.content}
                    renderItem={(item) => (
                      <List.Item
                        onClick={() => {
                          setCurrentSelectUser(item);
                          getFriendDetail(Number(friend.type), item);
                        }}
                      >
                        <List.Item.Meta avatar={<Avatar src={item.avatar} />} title={item.name} />
                      </List.Item>
                    )}
                  />
                </Collapse.Panel>
              ))}
            </Collapse>
          </Col>
          <Col span={18} style={{ padding: 80 }}>
            <Card>
              <div style={{ padding: 120 }}>
                {friendMessage ? (
                  <UserProfile
                    friendMessage={friendMessage}
                    onCall={() => alert('功能尚未开通')}
                    onMessage={() => {
                      let sendMessageTarget = 0;
                      for (let conversation of conversations) {
                        if (conversation.id === currentSelectUser?.roomId) {
                          setActiveConversation(conversation);
                          sendMessageTarget = sendMessageTarget + 1;
                        }
                      }
                      if (sendMessageTarget === 0) {
                        const target: API.RoomVo = {
                          id: currentSelectUser?.roomId,
                          userId: currentSelectUser?.uid,
                          type: friendMessage?.type,
                          roomName: currentSelectUser?.name,
                          avatar: currentSelectUser?.avatar,
                        };
                        setActiveConversation(target);
                        setConversations([target, ...conversations]);
                      }
                      setActiveKey('1');
                    }}
                    onVideo={() => alert('功能尚未开通')}
                  />
                ) : (
                  <Empty description={'快找小伙伴聊天吧 ( ゜- ゜)つロ'} />
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </Tabs.TabPane>
      <Tabs.TabPane
        icon={
          <Badge count={messageNum?.noticeNum}>
            <FontAwesomeIcon style={{ fontSize: '26px' }} icon={faEnvelopeOpenText} />
          </Badge>
        }
        style={{ height: '100vh' }}
        key="3"
      >
        <div
          id="scrollableDiv"
          style={{
            height: '100vh',
            overflow: 'auto',
            padding: 100,
            border: '1px solid rgba(140, 140, 140, 0.35)',
          }}
        >
          <InfiniteScroll
            dataLength={noticeMessages.length}
            next={loadMoreData}
            hasMore={noticeMessages.length < -1}
            loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
            endMessage={<Divider plain>没有了 🤐</Divider>}
            scrollableTarget="scrollableDiv"
          >
            <List
              itemLayout="horizontal"
              dataSource={noticeMessages}
              renderItem={(item, index) => (
                <Card style={{ marginTop: 10 }}>
                  <List.Item
                    onClick={() => onRead(item.id, index)}
                    style={{ padding: 20, marginTop: 10 }}
                    actions={[
                      item.processResult ? (
                        <>{item.processResult}</>
                      ) : (
                        <>
                          <a
                            key={index}
                            onClick={() => handleMessage(item.id, index, item?.noticeType, 1)}
                          >
                            <FontAwesomeIcon
                              style={{ fontSize: '26px', color: 'green' }}
                              icon={faSquareCheck}
                            />
                          </a>
                          ,
                          <a
                            key={index}
                            onClick={() => handleMessage(item.id, index, item?.noticeType, 2)}
                          >
                            <FontAwesomeIcon
                              style={{ fontSize: '26px', color: 'red' }}
                              icon={faXmark}
                            />
                          </a>
                        </>
                      ),
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Badge
                          count={
                            item.readTarget === 0 ? (
                              <FontAwesomeIcon icon={faVolumeHigh} style={{ color: 'red' }} />
                            ) : (
                              0
                            )
                          }
                        >
                          <Avatar src={item.avatar} />
                        </Badge>
                      }
                      title={item.title}
                      description={item.noticeContent}
                    />
                  </List.Item>
                </Card>
              )}
            />
          </InfiniteScroll>
        </div>
      </Tabs.TabPane>
    </Tabs>
  );
};

export default Welcome;
