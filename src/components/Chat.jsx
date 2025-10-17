import React, { useContext } from 'react';
// import Cam from "../img/cam.png";
// import Add from "../img/add.png";
// import More from "../img/more.png";
import { ChatContext } from '../context/ChatContext';
import Input from './Input';
import Messages from './Messages';

const Chat = () => {
  const { data } = useContext(ChatContext);

  // console.log('Chat component - Current data:', data);

  return (
    <div className="chat">
      <div className="chatInfo">
        <span>
          {data.user?.displayName || 'Select a user to start chatting'}
        </span>
        <div className="chatIcons">
          {/* <img src={Cam} alt="" />
          <img src={Add} alt="" />
          <img src={More} alt="" /> */}
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
