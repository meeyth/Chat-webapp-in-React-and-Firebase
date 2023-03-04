import React, { useContext, useEffect, useState } from "react";
import { doc, onSnapshot, } from "firebase/firestore";
import friend from "../assets/imgs/profile1.jpg";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Chats = () => {
  const [chats, setChats] = useState();
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const fetchChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(Object.entries(doc.data()));
      });

      return () => { unsub() };
    }

    currentUser.uid && fetchChats()

  }, [currentUser.uid])


  const handleSelect = (userInfo) => {
    console.log(userInfo);
    dispatch({ type: "CHANGE_USER", payload: userInfo })
  }

  return (
    <>
      {chats?.sort((a, b) => b[1].date - a[1].date).map(chat => (
        <div className="chatfriendWrapper" key={chat[0]} onClick={() => handleSelect(chat[1].userInfo)}>
          <img src={chat[1].userInfo.photoURL} alt="" />
          <div className="friendDetails">
            <span className="name">{chat[1].userInfo.displayName}</span>
            <span className="lastMessage">{chat[1].lastMessage?.text}</span>
          </div>
        </div>

      ))}
    </>
  );
};

export default Chats;
