import React, { useState, useEffect } from "react";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../FirebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import Header from "./header";

const MealPlanner = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
      try {
        if (user && user.uid) {
          const userDocRef = doc(FIRESTORE_DB, "users", user.uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const data = userDocSnapshot.data();
            setUserData(data);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return (
      <div>
        <Header />
        <section className="text-gray-600 body-font">
          <div className="container px-5 py-24 mx-auto">
            <div className="text-3xl font-medium mb-2 text-white">
              To access the weekly and daily meal planner, you have to create an
              account or log in to an existing account.
            </div>
            <Link to="/registration">
              <button className="button signUpButton">
                <span className="buttonText">Sign Up</span>
              </button>
            </Link>
            <Link to="/Login">
              <button className="button signUpButton">
                <span className="buttonText">Log In</span>
              </button>
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="text-3xl font-medium mb-2 text-white">
            Welcome, {userData.firstName} {userData.lastName}!
          </div>
          <button
            className="button generateDailyMealPlanButton"
            onClick={() => navigate("/generate-day-meal-plan")}
          >
            <span className="buttonText">Generate Daily Meal Plan</span>
          </button>
          <button
            className="button generateWeeklyMealPlanButton"
            onClick={() => navigate("/generate-week-meal-plan")}
          >
            <span className="buttonText">Generate Weekly Meal Plan</span>
          </button>
          <button className="button signOutButton" onClick={handleSignOut}>
            <span className="buttonText">Sign Out</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default MealPlanner;
