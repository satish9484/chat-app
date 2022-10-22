import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
// import { getStorage,
// ref,
// deleteObject
//  } from "firebase/storage";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();
  //const storage = getStorage();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  // const deleteTheMessage = () => {
  //   const desertRef = ref(storage, data.user.message.img);

  //   // Delete the file
  //   deleteObject(desertRef)
  //     .then(() => {
  //       // File deleted successfully
  //     })
  //     .catch((error) => {
  //       // Uh-oh, an error occurred!
  //     });
  // };

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
      </div>
      <div className="messageContent">
        <p>
          {message.text}
          {message.img && <img src={message.img} alt="" />}
        </p>
      </div>
    </div>
  );
};

export default Message;
