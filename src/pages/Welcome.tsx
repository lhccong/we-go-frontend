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
import {Card, Empty} from "antd";
import {listRoomVoByPageUsingPost} from "@/services/backend/chatController";
import moment from 'moment';
import {useModel} from "@@/exports";

const Welcome: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const [loadingMore, setLoadingMore] = useState(false);
  const msgListRef = useRef(null);
  const { currentUser } = initialState || {};
  const [activeConversation, setActiveConversation] = useState<API.RoomVo>();
  const [conversations, setConversations] = useState<API.RoomVo[]>([]);
  // Set initial message input value to empty string
  const [messageInputValue, setMessageInputValue] = useState("");
  const [total, setTotal] = useState<string>()

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
      current: 0
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
            <ConversationHeader.Content userName={activeConversation.roomName} info={moment(activeConversation.activeTime).format('MMMDo a h:mm ')}/>
            <ConversationHeader.Actions>
              <InfoButton/>
            </ConversationHeader.Actions>
          </ConversationHeader>
          <MessageList ref={msgListRef} loadingMore={loadingMore}>

            <MessageSeparator content={moment(activeConversation.activeTime).format('MMMDo a h:mm ')}/>

            <Message model={{
              message: "Hello my friend",
              sentTime: "15 mins ago",
              sender: "Zoe",
              direction: "incoming",
              position: "single"
            }}>
              <Avatar
                src='https://img0.baidu.com/it/u=1455188211,4132484470&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1708448400&t=b8e8e5f8dc7e7ece5e4db2f1b0a12813'
                name="Zoe"/>
            </Message>

            <Message model={{
              message: "Hello my friend",
              sentTime: "15 mins ago",
              sender: "Patrik",
              direction: "outgoing",
              position: "single"
            }} >
              <Avatar
                src={currentUser?.userAvatar}
                name="Zoe"/>
            </Message><Message model={{
              message: "Hello my friend",
              sentTime: "15 mins ago",
              sender: "Patrik",
              direction: "outgoing",
              position: "single"
            }} >
              <Avatar
                src={currentUser?.userAvatar}
                name="Zoe"/>
            </Message><Message model={{
              message: "Hello my friend",
              sentTime: "15 mins ago",
              sender: "Patrik",
              direction: "outgoing",
              position: "single"
            }} >
              <Avatar
                src={currentUser?.userAvatar}
                name="Zoe"/>
            </Message><Message model={{
            message: "Hello my friend",
            sentTime: "15 mins ago",
            sender: "Zoe",
            direction: "incoming",
            position: "single"
          }}>
            <Avatar
              src='https://img0.baidu.com/it/u=1455188211,4132484470&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1708448400&t=b8e8e5f8dc7e7ece5e4db2f1b0a12813'
              name="Zoe"/>
          </Message><Message model={{
              message: "Hello my friend",
              sentTime: "15 mins ago",
              sender: "Patrik",
              direction: "outgoing",
              position: "single"
            }} >
              <Avatar
                src={currentUser?.userAvatar}
                name="Zoe"/>
            </Message><Message model={{
            message: "Hello my friend",
            sentTime: "15 mins ago",
            sender: "Zoe",
            direction: "incoming",
            position: "single"
          }}>
            <Avatar
              src='https://img0.baidu.com/it/u=1455188211,4132484470&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1708448400&t=b8e8e5f8dc7e7ece5e4db2f1b0a12813'
              name="Zoe"/>
          </Message><Message model={{
              message: "Hello my friend",
              sentTime: "15 mins ago",
              sender: "Patrik",
              direction: "outgoing",
              position: "single"
            }} >
              <Avatar
                src={currentUser?.userAvatar}
                name="Zoe"/>
            </Message><Message model={{
            message: "Hello my friend",
            sentTime: "15 mins ago",
            sender: "Zoe",
            direction: "incoming",
            position: "single"
          }}>
            <Avatar
              src='https://img0.baidu.com/it/u=1455188211,4132484470&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1708448400&t=b8e8e5f8dc7e7ece5e4db2f1b0a12813'
              name="Zoe"/>
          </Message><Message model={{
              message: "Hello my friend",
              sentTime: "15 mins ago",
              sender: "Patrik",
              direction: "outgoing",
              position: "single"
            }} >
              <Avatar
                src={currentUser?.userAvatar}
                name="Zoe"/>
            </Message><Message model={{
            message: "Hello my friend",
            sentTime: "15 mins ago",
            sender: "Zoe",
            direction: "incoming",
            position: "single"
          }}>
            <Avatar
              src='https://img0.baidu.com/it/u=1455188211,4132484470&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1708448400&t=b8e8e5f8dc7e7ece5e4db2f1b0a12813'
              name="Zoe"/>
          </Message>
          </MessageList>
          <MessageInput placeholder="Type message here" value={messageInputValue}
                        onChange={val => setMessageInputValue(val)} onSend={() => setMessageInputValue("")}/>
        </ChatContainer>
      }
    </MainContainer>)
};
export default Welcome;
