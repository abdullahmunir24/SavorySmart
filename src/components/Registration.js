import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../FirebaseConfig";
import { connectUserToSpoonacular } from "./Spoonacular";
import "./Registration.css";
import InputStuff from "../snippets/InputStuff";
import { useNavigate } from "react-router-dom";
import Header from "./header";

export default function Registration() {
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [InputError, setInputError] = useState("");
  const [UserId, setUserId] = useState("");
  const navigate = useNavigate();

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

      const spoonacularInfo = await connectUserToSpoonacular({
        username: `user_${user.uid}`,
        firstName: firstname,
        lastName: lastname,
        email: email,
      });

      console.log("Spoonacular Info:", spoonacularInfo);

      if (
        spoonacularInfo.status === "failure" &&
        spoonacularInfo.code === 401
      ) {
        throw new Error("Spoonacular connection failed: Unauthorized");
      }

      alert("Your account has been created");

      navigate("/mealplanner");

      setEmail("");
      setFirstname("");
      setLastname("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Registration failed:", error);
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
    <div>
      <Header />
      <div className="container registration-container">
        <img
          src={require("../Images/SS.png")}
          className="image"
          alt="UBC logo"
        />

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
            {password.length > 0 && password.length < 6 && (
              <h5>Password should be at least 6 characters.</h5>
            )}
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
          {confirmpassword.length > 0 && password !== confirmpassword && (
            <h5>Passwords do not match.</h5>
          )}

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

        <button>
          <div className="signInButton" onClick={() => navigate("/Login")}>
            <span className="signInButtonText">
              If you already have an account, please sign in
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
