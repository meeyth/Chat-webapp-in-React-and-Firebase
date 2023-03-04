import React, { useState } from "react";
import avatar from "../assets/imgs/addAvatar.png";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { auth, storage, db } from "../firebase";
import Tilt from 'react-parallax-tilt';

const Register = () => {
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    setErr("");
    e.preventDefault();
    const username = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const profileImg = e.target[3]?.files[0];

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const imgRef = ref(storage, "images/" + profileImg?.name);
      const uploadTask = uploadBytesResumable(imgRef, profileImg);

      uploadTask.on(
        "state_changed",

        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (err) => {
          setErr(err.code);
        },

        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateProfile(user, {
              displayName: username,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, "users", user.uid), {
              uid: user.uid,
              displayName: username,
              email,
              photoURL: downloadURL,
              created: Timestamp.fromDate(new Date()),
            });

            await setDoc(doc(db, "userChats", user.uid), {})
            navigate("/")
          });
        }
      );

    } catch (e) {
      setErr("Oops! " + e.message);
    }
  };

  return (
    <div className="formContainer">
      <Tilt>

        <div className="formWrapper">
          <span className="logo">Chattify 💜</span>
          <span className="heading">Register</span>
          <form onSubmit={onSubmitHandler}>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              required
            />
            <input type="email" name="email-id" id="email" placeholder="Email" required />
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              required
            />
            <label htmlFor="avatar">
              <img src={avatar} alt="avatar" />
              <p>Add your Avatar</p>
            </label>
            <input type="file" name="avatar" id="avatar" required />
            {err ? <p style={{ color: "#F5564A" }}>{err}</p> : null}
            <button>Sign up</button>
          </form>
          <p>
            Welcome back!{" "}
            <Link to="/login" className="link">
              Login
            </Link>
          </p>
        </div>
      </Tilt>
    </div>
  );
};

export default Register;
