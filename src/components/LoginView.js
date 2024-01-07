import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../FirebaseConfig";
import { AntDesign } from "react-icons/ai";
import { collection, query, where, getDocs } from "firebase/firestore";
import InputStuff from "../snippets/InputStuff";
import { useNavigate } from "react-router-dom";
import "./LoginView.css";

export default function LoginView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = FIREBASE_AUTH;
  const navigate = useNavigate(); 

  const signIn = async () => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const user = response.user;
      const idToken = await user.getIdToken();
      console.log("Firebase ID token:", idToken);
      alert("Logged in successfully");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log(error);
      alert("Sign in failed: " + error.message);
    }
  };

  const isFormValid = () => {
    return email.includes("@") && password.length >= 6;
  };

  const checkUserExists = async () => {
    const usersCollection = collection(FIRESTORE_DB, "users");
    const userQuery = query(usersCollection, where("email", "==", email));
    const userQuerySnapshot = await getDocs(userQuery);
    return !userQuerySnapshot.empty;
  };

  const handleLogin = async () => {
    if (!isFormValid()) {
      alert("Please enter a valid email and password.");
      return;
    }

    try {
      const userExists = await checkUserExists();
      if (userExists) {
        await signIn();
      } else {
        alert("User does not exist. Create a new account.");
      }
    } catch (error) {
      console.log(error);
      alert("Sign in failed: " + error.message);
    }
  };

  return (
    <div className="container">
      <img src={require("../Images/SS.png")} className="image" alt="UBC logo" />

      <div className="formContainer">
        <div className="inputContainer">
          <InputStuff
            value={email}
            title="Email Address"
            placeholder="examplename@gmail.com"
            onChangeText={setEmail}
          />
        </div>

        <div className="inputContainer">
          <InputStuff
            value={password}
            title="Password"
            placeholder="Enter Password"
            isSecure={true}
            onChangeText={setPassword}
          />
        </div>
      </div>

      <button
        className={isFormValid() ? "button" : "disabledButton"}
        onClick={handleLogin}
        disabled={!isFormValid()}
      >
        <span className="buttonText">Log In</span>
      </button>

      <button
        className="signUpButton"
        onClick={() => navigate("/register-user")}
      >
        <span className="signUpButtonText">Don't have an account? Sign up</span>
      </button>
    </div>
  );
}
