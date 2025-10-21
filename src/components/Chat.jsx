import React from 'react';
// import Cam from "../img/cam.png";
// import Add from "../img/add.png";
// import More from "../img/more.png";
//import { ChatContext } from '../context/ChatContext';
import ChatHeader from './ChatHeader';
import Input from './Input';
import Messages from './Messages';

const Chat = ({ onToggleSidebar, isSidebarOpen }) => {
  // const { data } = useContext(ChatContext);

  // console.log('Chat component - Current data:', data);

  return (
    <div className="chat">
      <ChatHeader
        onToggleSidebar={onToggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
