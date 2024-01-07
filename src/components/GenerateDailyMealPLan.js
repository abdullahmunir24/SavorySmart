import React, { useState } from "react";
import axios from "axios";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../FirebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import "./GenerateDailyMealPlan.css";
import { Link, useNavigate } from "react-router-dom";
import Header from "./header";

const GenerateMealPlanDaily = () => {
  const [targetCalories, setTargetCalories] = useState(2000);
  const [diet, setDiet] = useState("vegetarian");
  const [exclude, setExclude] = useState("");
  const [mealPlan, setMealPlan] = useState([]);
  const navigate = useNavigate();

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

      const dailyPlan = [];

      const response = await axios.get(
        "https://api.spoonacular.com/mealplanner/generate",
        {
          params: {
            timeFrame: "day",
            targetCalories,
            diet,
            exclude,
            apiKey: `${process.env.REACT_APP_API_KEY}`,
          },
        }
      );

      const { meals, nutrients } = response.data;

      const enrichedMeals = meals.map((meal) => ({
        ...meal,
        nutrients: nutrients,
      }));

      dailyPlan.push(...enrichedMeals);

      setMealPlan(dailyPlan);
    } catch (error) {
      console.error("Error generating meal plan:", error);
    }
  };

  const addRecipeToMealPlan = async (selectedRecipe) => {
    try {
      const { currentUser } = FIREBASE_AUTH;

      const userDocRef = doc(FIRESTORE_DB, "users", currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (!userDocSnapshot.exists()) {
        console.error("User document not found");
        return;
      }

      const mealPlan = userDocSnapshot.data().mealPlan || { recipes: [] };

      mealPlan.recipes.push({
        recipeId: selectedRecipe.id,
        title: selectedRecipe.title,
        imageType: selectedRecipe.imageType,
      });

      await setDoc(userDocRef, { mealPlan }, { merge: true });

      console.log("Recipe added to meal plan:", selectedRecipe);
    } catch (error) {
      console.error("Error adding to meal plan:", error);
    }
  };

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
                  <button
                    className="button addToPlanButton"
                    onClick={() => addRecipeToMealPlan(meal)}
                  >
                    <span className="buttonText">Add to Meal Plan</span>
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
