import React, {useEffect, useRef, useState} from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  Avatar,
  ChatContainer,
  Conversation, ConversationHeader,
  ConversationList, InfoButton,
  MainContainer, Message, MessageInput, MessageList, MessageSeparator,
  Search,
  Sidebar
} from "@chatscope/chat-ui-kit-react";
import {Avatar as Avatars, Button, Divider, Empty, Space} from "antd";
import {listMessageVoByPageUsingPost, listRoomVoByPageUsingPost} from "@/services/backend/chatController";
import moment from 'moment';
import {useModel} from "@@/exports";
import {PoweroffOutlined, UserOutlined} from '@ant-design/icons';

const Welcome: React.FC = () => {
  const {initialState} = useModel('@@initialState');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [msgTotal, setMsgTotal] = useState(0);
  const [messages, setMessages] = useState<API.ChatMessageResp[]>([]);
  const msgListRef = useRef(null);
  const {currentUser} = initialState || {};
  const [activeConversation, setActiveConversation] = useState<API.RoomVo>();
  const [conversations, setConversations] = useState<API.RoomVo[]>([]);
  // Set initial message input value to empty string
  const [messageInputValue, setMessageInputValue] = useState("");
  const [total, setTotal] = useState<string>()

  //首先获取所有conversation
  useEffect(() => {
    const tokenValue = localStorage.getItem('tokenValue');
    const newSocket = new WebSocket('ws://172.21.12.27:8090?token=' + tokenValue);
    setSocket(newSocket);

    // 在组件卸载时关闭WebSocket连接
    return () => {
      newSocket.close();
    };
  }, [])

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
            socket.send(JSON.stringify({type: 4}));
          }
        }, 10000); // 每10秒发送一次心跳消息
      };
      //接收数据
      socket.onmessage = (event) => {
        const res: API.Chat = JSON.parse(event.data);
        if (res.data && res.type === 2) {
          const {roomId} = res.data;
          if (activeConversation && roomId === Number(activeConversation.id)) {
            //设置聊天消息
            console.log(...messages);

            setMessages([...messages, res.data])
            //设置左侧栏的消息
          }
        }
      }
      //关闭连接
      socket.onclose = () => {
        console.log('WebSocket连接已关闭');
      };
      //连接错误
      socket.onerror = (error) => {
        console.error('WebSocket发生错误:', error);
      };
    }
  }, [socket, conversations]);

  useEffect(() => {
    //获取与用户的所有聊天消息
    if (activeConversation && activeConversation.userId) {
      listMessageVoByPageUsingPost({
        pageSize: 30,
        roomId: activeConversation.id
      }).then(res => {
        if (res.code === 0) {
          if (res.data?.records) {
            setMessages(res.data?.records);
            setMsgTotal(Number(res.data?.total));

          }
        }
      })
    }
  }, [activeConversation]);

  //发送消息
  const sendMessage = (message: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const command = {
        type: 2,
        userId: activeConversation?.userId,
        data: message

      };
      socket.send(JSON.stringify(command));
    }
  };
  const changeConversation = (newConversation: API.RoomVo) => {
    if (!activeConversation || newConversation.id !== activeConversation.id) {
      setActiveConversation({...newConversation, unreadNum: 0});
      setConversations(conversations.map(conversation =>
        conversation.id === newConversation.id ? {...newConversation, unread: 0} : conversation));
      // if (socket && socket.readyState === WebSocket.OPEN) {
      //   //TODO 切换会话
      //   // const command = {
      //   //   code: 10003,
      //   //   uid: currentUser?.uid,
      //   //   conversationId: newConversation.id
      //   // };
      //   // socket.send(JSON.stringify(command));
      // }
    }
    // @ts-ignore
    msgListRef.current?.scrollToBottom();
  }
  // 组件加载时和页码变化时触发数据获取
  useEffect(() => {
    listRoomVoByPageUsingPost({
      pageSize: 10,
      current: 0,
    }).then((res) => {
      if (res.code === 0) {
        // @ts-ignore
        setConversations(res.data?.records);
        setTotal(res.data?.total);
      }
    });
  }, [total]);
  return (
    <MainContainer responsive>
      <Sidebar position="left" scrollable={false}>
        <Search placeholder="Search..."/>
        <ConversationList>
          {
            conversations.map(conversation =>
              <Conversation
                active={activeConversation && activeConversation.id === conversation.id}
                onClick={() => changeConversation(conversation)}
                lastActivityTime={moment(conversation.activeTime).format('MMMDo a h:mm ')}
                key={conversation.id}
                name={conversation.roomName}
                info={conversation.content}
                unreadCnt={conversation.unreadNum}
              >
                <Avatar src={conversation.avatar} status="available"/>
              </Conversation>)
          }
        </ConversationList>
        <Divider/>
        <Space style={{paddingLeft: 10, paddingBottom: 8}}>
          {currentUser?.userAvatar ? (
            <Avatars size="default" src={currentUser?.userAvatar}/>
          ) : (
            <Avatars size="default" icon={<UserOutlined/>}/>
          )}
          <span>{currentUser?.userName ?? '无名'}</span>
          <Button style={{marginLeft: 80}} type="primary" shape="circle" icon={<PoweroffOutlined/>}/>
        </Space>
      </Sidebar>
      {!activeConversation ?
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            backgroundImage: 'url(/images/empty.png)',
            backgroundSize: '402px 204px',
            marginBottom: 32,
            width: 402,
            height: 204
          }}/>
          <div style={{color: ' #8896b8', fontSize: 14, lineHeight: '20em'}}>
            <Empty description={"快找小伙伴聊天吧 ( ゜- ゜)つロ"}/>.
          </div>
        </div> :
        <ChatContainer>
          <ConversationHeader>
            <ConversationHeader.Back/>
            <Avatar
              src={activeConversation.avatar}
              name={activeConversation.id}/>
            <ConversationHeader.Content userName={activeConversation.roomName}
                                        info={moment(activeConversation.activeTime).format('MMMDo a h:mm ')}/>
            <ConversationHeader.Actions>
              <InfoButton/>
            </ConversationHeader.Actions>
          </ConversationHeader>
          <MessageList ref={msgListRef} loadingMore={loadingMore}>

            <MessageSeparator content={moment(activeConversation.activeTime).format('MMMDo a h:mm ')}/>
            {
              messages.map((message, index) => {
                const flag = message.fromUser?.uid === currentUser?.id;
                return <Message key={index} model={{
                  message: message.message?.content,
                  sender: message.fromUser?.username,
                  direction: flag ? "outgoing" : "incoming",
                  position: "single"
                }} avatarPosition={flag ? 'tr' : 'tl'}>
                  <Avatar style={{width: 36, minWidth: 36, height: 36, minHeight: 36}} src={message.fromUser?.avatar}
                          name="Zoe"/>
                </Message>
              })
            }
          </MessageList>
          <MessageInput placeholder="Type message here" value={messageInputValue}
                        onChange={val => setMessageInputValue(val)}
                        onSend={() => {
                          setMessageInputValue("")
                          const msg = {
                            type: 2,
                            toUid: activeConversation?.userId,
                            content: messageInputValue,
                          }
                          const msgVo: API.ChatMessageResp = {
                            fromUser: {
                              uid: currentUser?.id,
                              username: currentUser?.userName,
                              avatar: currentUser?.userAvatar,
                            },
                            message: {
                              content: messageInputValue,
                            },
                          }
                          setMessages([...messages, msgVo]);
                          setConversations([{...activeConversation, content: messageInputValue},
                            ...conversations.filter(conversation =>
                              conversation.id !== activeConversation?.id)])
                          sendMessage(msg);
                        }}/>
        </ChatContainer>
      }
    </MainContainer>)
};
export default Welcome;
