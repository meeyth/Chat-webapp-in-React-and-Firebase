import React, { useContext, useState } from "react";
import { FaRegPaperPlane } from "react-icons/fa";

import { BiImageAdd } from "react-icons/bi";
import { Timestamp, arrayUnion, doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { v4 as uuid } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    console.log(data.chatId);
    if (img) {
      const imgRef = ref(storage, "photos/" + uuid());
      const uploadTask = uploadBytesResumable(imgRef, img);

      uploadTask.on(
        "state_changed",

        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (err) => {
          console.log(err.code);
        },

        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              })
            });
          });
        }
      );

    } else {
      await updateDoc(doc(db, "chats", data.chatId), {

        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        })
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),

    })
    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),

    })

    setImg(null);
    setText("");
  };

  return (
    <div className="chatInput">
      <input
        type="text"
        name=""
        id=""
        placeholder="Type here..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="inputIcons">
        <input
          type="file"
          name="image"
          id="image"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="image">
          <BiImageAdd className="icon imgAddIcon" />
        </label>
        <button onClick={handleSend}>
          <FaRegPaperPlane className="icon" />
        </button>
      </div>
    </div>
  );
};

export default Input;
