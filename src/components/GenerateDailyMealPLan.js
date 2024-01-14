import React, { useState, useEffect } from "react";
import axios from "axios";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import Header from "./header";
import "./GenerateDailyMealPlan.css";

const GenerateMealPlanDaily = () => {
  const [targetCalories, setTargetCalories] = useState(2000);
  const [diet, setDiet] = useState("vegetarian");
  const [exclude, setExclude] = useState("");
  const [mealPlan, setMealPlan] = useState([]);
  const navigate = useNavigate();

  const isAuthenticated = FIREBASE_AUTH.currentUser !== null;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/mealplanner");
    }
  }, [isAuthenticated, navigate]);

  const handleGenerateMealPlan = async () => {
    try {
      const { currentUser } = FIREBASE_AUTH;
      const userDocRef = doc(FIRESTORE_DB, "users", currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (!userDocSnapshot.exists()) {
        console.error("User document not found");
        return;
      }
    } catch (error) {
      console.error("Error generating meal plan:", error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      <Header />
      <div className="meal-plan-container">
        <h1 className="main-heading">Generate Your Daily Meal Plan</h1>
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
            Diet (e.g vegetarian, chicken):
            <input
              type="text"
              value={diet}
              onChange={(e) => setDiet(e.target.value)}
              className="input-box"
            />
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
        <button className="button" onClick={handleGenerateMealPlan}>
          <span className="buttonText">Generate Meal Plan</span>
        </button>

        <main className="weekly-carousel">
          {mealPlan.map((meal, index) => (
            <div key={index} className="day-plan">
              <h2>
                {index % 3 === 0
                  ? "Breakfast"
                  : index % 3 === 1
                  ? "Lunch"
                  : "Dinner"}
              </h2>
              <div className="meal-carousel">
                <div className="meal-item">
                  <h3>{meal.title}</h3>
                  <img
                    src={`https://spoonacular.com/recipeImages/${meal.id}-312x231.jpg`}
                    alt={meal.title}
                    className="g-img"
                  />
                  <p>{meal.title}</p>
                  <p>Ready in {meal.readyInMinutes} minutes</p>
                  <p>Servings: {meal.servings}</p>

                  {meal.nutrients && (
                    <div className="nutrient-info">
                      <p>Calories: {meal.nutrients.calories.toFixed(2)}</p>
                      <p>
                        Carbohydrates: {meal.nutrients.carbohydrates.toFixed(2)}
                      </p>
                      <p>Fat: {meal.nutrients.fat.toFixed(2)}</p>
                      <p>Protein: {meal.nutrients.protein.toFixed(2)}</p>
                    </div>
                  )}
                  <button
                    className="button viewRecipeButton"
                    onClick={() => navigate(`/random-recipe/${meal.id}`)}
                  >
                    <span className="buttonText">View Recipe</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};

export default GenerateMealPlanDaily;
