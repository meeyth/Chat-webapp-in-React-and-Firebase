import React, { useContext, useState } from "react";
import { collection, getDocs, query, where, updateDoc, serverTimestamp, getDoc, setDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext"

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState();
  const [err, setErr] = useState("");
  const [noUser, setNoUser] = useState(false)

  const { currentUser } = useContext(AuthContext)


  const handleSearch = async () => {
    setUser(null)
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("displayName", "==", username));

    try {
      const querySnapshot = await getDocs(q);

      querySnapshot.size === 0 ? setNoUser(true) : setNoUser(false)

      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      setErr("Oops!" + err.message)
    }

  }

  const handleKey = e => e.code === "Enter" && handleSearch()


  const handleSelect = async () => {
    console.log("handle select called");

    console.log(user);
    const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;

    try {
      // Checking the chat exists or not
      const res = await getDoc(doc(db, "chats", combinedId))

      if (!res.exists()) {
        // Create a chat doc in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] })

        // Create/Update a user-chat instance in userChat collection

        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),

        })

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),

        })
      }

    } catch (e) {
      console.log(e);

    }

    setUser(null)
    setUsername("")
  }

  return (
    <div className="searchBarContainer">
      <input type="text" name="friend" id="" placeholder="Find friend" value={username} onChange={(e) => setUsername(e.target.value)} onKeyDown={handleKey} />
      {err ? <p style={{ color: "#F5564A" }}>{err}</p> : null}
      {user ?
        <div className="userContainer" onClick={() => handleSelect()}>
          <img src={user.photoURL} alt="avatar" />
          <p className="name">{user.displayName}</p>
        </div> :
        null
      }
      {noUser && <p className="warning">No user found</p>}
    </div>
  );
};

export default Search;
