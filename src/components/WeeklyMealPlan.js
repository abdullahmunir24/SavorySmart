import React, { useState, useEffect } from "react";
import axios from "axios";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Header from "./header";
import { Link, useNavigate } from "react-router-dom";
import "./GenerateWeeklyMealPlan.css";

const DayLabels = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const GenerateWeeklyMealPlan = () => {
  const [targetCalories, setTargetCalories] = useState(2000);
  const [diet, setDiet] = useState("vegetarian");
  const [exclude, setExclude] = useState("");
  const [weeklyMealPlan, setWeeklyMealPlan] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      const user = FIREBASE_AUTH.currentUser;

      if (!user) {
        navigate("/mealplanner");
      }
    };

    checkAuthentication();
  }, [navigate]);

  const handleGenerateMealPlan = async () => {
    try {
      const { currentUser } = FIREBASE_AUTH;
      const userDocRef = doc(FIRESTORE_DB, "users", currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (!userDocSnapshot.exists()) {
        console.error("User document not found");
        return;
      }

      const userData = userDocSnapshot.data();
      if (!userData || !userData.spoonacular) {
        console.error("Spoonacular data not found in user document");
        return;
      }

      const { username, hash } = userData.spoonacular;

      const weeklyPlan = [];

      for (const day of DayLabels) {
        const response = await axios.get(
          "https://api.spoonacular.com/mealplanner/generate",
          {
            params: {
              timeFrame: "day",
              targetCalories,
              diet,
              exclude,
              apiKey: `${process.env.REACT_APP_API_KEY_generate}`,
            },
          }
        );

        const { meals, nutrients } = response.data;

        const enrichedMeals = meals.map((meal) => ({
          ...meal,
        }));

        weeklyPlan.push({ day, meals: enrichedMeals, nutrients });
      }

      setWeeklyMealPlan(weeklyPlan);
    } catch (error) {
      console.error("Error generating meal plan:", error);
    }
  };

  const dietOptions = [
    "Gluten Free",
    "Ketogenic",
    "Vegetarian",
    "Vegetarian with dairy",
    "Vegetarian with egg",
    "Vegan",
    "Vegetarian with fish, seafood",
    "Meat,vegetables,nuts exculding grains",
    "Meat,vegetables,including dairy",
    "Whole Foods",
  ];

  return (
    <div>
      <Header />
      <div className="meal-plan-container">
        <h1 className="main-heading">Generate Your Weekly Meal Plan</h1>
        <div className="controls">
          <label>
            Target Calories (e.g 2000):
            <input
              type="number"
              value={targetCalories}
              onChange={(e) => setTargetCalories(e.target.value)}
              className="input-box"
            />
          </label>
          <label>
            Diet:
            <select
              value={diet}
              onChange={(e) => setDiet(e.target.value)}
              style={{ color: "black" }}
            >
              {dietOptions.map((option) => (
                <option key={option} value={option.toLowerCase()}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label>
            Exclude from diet (e.g shellfish, olives):
            <input
              type="text"
              value={exclude}
              onChange={(e) => setExclude(e.target.value)}
              className="input-box"
            />
          </label>
        </div>
        <button onClick={handleGenerateMealPlan}>
          Generate Weekly Meal Plan
        </button>

        <div className="weekly-carousel">
          {weeklyMealPlan.map((dayPlan) => (
            <div key={dayPlan.day} className="day-plan">
              <h2>{dayPlan.day}</h2>
              <div className="meal-carousel">
                {dayPlan.meals.map((meal, index) => (
                  <div key={index} className="meal-item">
                    <h3>
                      {index % 3 === 0
                        ? "Breakfast"
                        : index % 3 === 1
                        ? "Lunch"
                        : "Dinner"}
                    </h3>
                    <img
                      src={`https://spoonacular.com/recipeImages/${meal.id}-312x231.jpg`}
                      alt={meal.title}
                    />
                    <p>{meal.title}</p>
                    <p>Ready in {meal.readyInMinutes} minutes</p>
                    <p>Servings: {meal.servings}</p>
                    <button
                      className="button viewRecipeButton"
                      onClick={() => navigate(`/random-recipe/${meal.id}`)}
                    >
                      <span className="buttonText">View Recipe</span>
                    </button>{" "}
                  </div>
                ))}
                {dayPlan.nutrients && (
                  <div>
                    <h2>Daily Total Values</h2>

                    <div>
                      <div className="nutrient-info">
                        <p>Calories: {dayPlan.nutrients.calories.toFixed(2)}</p>
                        <p>
                          Carbohydrates:{" "}
                          {dayPlan.nutrients.carbohydrates.toFixed(2)}
                        </p>
                        <p>Fat: {dayPlan.nutrients.fat.toFixed(2)}</p>
                        <p>Protein: {dayPlan.nutrients.protein.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GenerateWeeklyMealPlan;
