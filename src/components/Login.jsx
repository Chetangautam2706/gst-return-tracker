import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import { toast } from "react-toastify";

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, username, password);

      alert("Login Successfull");

      setIsLoggedIn(true);
    } catch (error) {
      alert("Invalid Email or Password");
      console.log(error.message);
    }
  };

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, username, password);

      toast.success("User Registered");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("Email already exists");
        return;
      }
      toast.error(error.message);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        aligtnItems: "center",
        background: "#f4f4f4",
      }}
    >
      <div
        style={{
          padding: "30px",
          background: "white",
          borderRadius: "10px",
          width: "300px",
          boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Login</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "15px",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "15px",
          }}
        />

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "20px",
            cursor: "pointer",
            backgroundcolor: "#ff5722",
          }}
        >
          Login
        </button>

        <button
          onClick={handleSignup}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "10px",
            width: "100%",
            fontSize: "16px",
          }}
        >
          Create Account
        </button>
      </div>
    </div>
  );
}

export default Login;
