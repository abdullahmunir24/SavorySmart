import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, getDoc, setDoc, doc } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../FirebaseConfig";
import "./Registration.css";
import InputStuff from "../snippets/InputStuff";
import Birthday from "../snippets/Birthday";
import UploadImage from "../snippets/UplaodImage";

export default function Registration() {
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [InputError, setInputError] = useState("");
  const [UserId, setUserId] = useState("");

  useEffect(() => {
    if (password !== confirmpassword && confirmpassword !== "") {
      setInputError("Passwords do not match");
    } else if (password.length < 6 && password !== "") {
      setInputError("Password must be at least 6 characters long");
    } else if (firstname === "") {
      setInputError("Enter First Name");
    } else if (!email.includes("@") && email !== "") {
      setInputError("Enter a valid email address");
    } else if (lastname === "") {
      setInputError("Enter Last Name");
    } else {
      setInputError("");
    }
  }, [password, confirmpassword, email, firstname, lastname]);

  const signUp = async () => {
    if (password !== confirmpassword) {
      setInputError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setInputError("Password must be at least 6 characters long");
      return;
    }
    if (firstname === "") {
      setInputError("Enter First Name");
      return;
    }
    if (!email.includes("@") && email !== "") {
      setInputError("Enter a valid email address");
      return;
    }
    if (lastname === "") {
      setInputError("Enter Last Name");
      return;
    }

    try {
      const response = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      const user = response.user;

      const userRef = doc(FIRESTORE_DB, "users", user.uid);
      await setDoc(userRef, {
        firstName: firstname,
        lastName: lastname,
        email: email,
      });

      setUserId(user.uid);
      console.log(UserId);

      alert("Your account has been created");
      setEmail("");
      setFirstname("");
      setLastname("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.log(error);
      alert("Sign up failed: " + error.message);
    }
  };

  const isFormValid = () => {
    return (
      email !== "" &&
      email.includes("@") &&
      password !== "" &&
      password.length >= 6 &&
      password === confirmpassword &&
      firstname !== "" &&
      lastname !== ""
    );
  };

  return (
    <div className="container">
      <img src={require("../Images/SS.png")} className="image" alt="UBC logo" />

      <div className="formContainer">
        <div className="inputContainer">
          <InputStuff
            value={firstname}
            title="First Name"
            placeholder="Enter First Name"
            onChangeText={setFirstname}
          />
        </div>

        <div className="inputContainer">
          <InputStuff
            value={lastname}
            title="Last Name"
            placeholder="Enter Last Name"
            onChangeText={setLastname}
          />
        </div>

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

        <div className="confirmPasswordContainer">
          <InputStuff
            value={confirmpassword}
            title="Confirm Password"
            placeholder="Reenter Password"
            isSecure={true}
            onChangeText={setConfirmPassword}
          />
        </div>

        <Birthday />
        <UploadImage />

        <button
          className={["button", isFormValid() ? null : "disabledButton"].join(
            " "
          )}
          onClick={signUp}
          disabled={!isFormValid()}
        >
          <span className="buttonText">Sign Up</span>
        </button>
      </div>

      <div className="signInButton" onClick={() => "/Login"}>
        <span className="signInButtonText">
          If you already have an account, please sign in
        </span>
        <span className="errorMessage">{InputError}</span>
      </div>
    </div>
  );
}
