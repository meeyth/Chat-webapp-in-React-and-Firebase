import React, { useState } from "react";
import Tilt from 'react-parallax-tilt';
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Register = () => {
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setErr("");

    const email = e.target[0].value;
    const password = e.target[1].value;


    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate("/");
    }
    catch (e) {
      setErr("Oops! " + e.message);
    }
  };

  return (
    <div className="formContainer">
      <Tilt>
        <div className="formWrapper">
          <span className="logo">Chattify 💜</span>
          <span className="heading">Login</span>
          <form onSubmit={onSubmitHandler}>
            <input type="email" name="email-id" id="" placeholder="Email" required />
            <input type="password" name="password" id="" placeholder="Password" required />
            {err ? <p style={{ color: "#F5564A" }}>{err}</p> : null}
            <button>Login</button>
          </form>
          <p>
            Coming for the first time?{" "}
            <Link to="/register" className="link">
              Sign up
            </Link>
          </p>
        </div>
      </Tilt>
    </div>
  );
};

export default Register;
