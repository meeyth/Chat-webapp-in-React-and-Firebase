import React, { useContext, useEffect, useRef } from "react";
import friend from "../assets/imgs/friend.png";
import catPost from "../assets/imgs/catPost.jpg";
import catPost2 from "../assets/imgs/catPost2.jpg";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();
  useEffect(() => {
    ref.current?.scrollIntoView({
      behavior: "smooth"
    })
  }, [message]);

  return (
    <div className={`messageContainer ${message.senderId === currentUser.uid ? "" : "friend"}`} ref={ref}>
      <div className="chatContainer">
        <div className="imgContainer">
          <img src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL} alt="" />
        </div>


        <div className="textContainer">
          <p>{message.text}</p>
          <span>{message.date.toDate().toLocaleTimeString('en-US')}</span>
          <span>{message.date.toDate().toDateString()}</span>
        </div>
      </div>
      {message.img && <div className="postContainer">
        <img src={message.img} alt="" />
      </div>}
    </div>
  );
};

export default Message;
