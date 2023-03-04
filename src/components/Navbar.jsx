import React, { useContext } from "react";
import user from "../assets/imgs/userProfile.png";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {

  const { currentUser } = useContext(AuthContext);
  const { photoURL, displayName } = currentUser;
  const navigate = useNavigate()
  console.log(currentUser, "nav");


  return (
    <div className="navbar">
      <h3>Chattify 💜</h3>
      <div className="underline"></div>
      <div className="profileContainer">
        <div className="userDetails">
          <div className="profileImg">
            <img src={photoURL} alt="user image" />
          </div>
          <div className="userName">{displayName}</div>
        </div>
        <div className="buttonContainer">
          <button onClick={() => { signOut(auth), navigate("/login") }}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
