import React, { useState, useEffect } from "react";
import axios from "axios";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../FirebaseConfig";
import { getDoc, doc, deleteDoc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import Header from "./header";

const MealPlanner = () => {
  const { currentUser } = FIREBASE_AUTH;
  const [mealPlanItems, setMealPlanItems] = useState([]);
  const [detailedMealPlan, setDetailedMealPlan] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAllData = async () => {
    try {
      const mealPlanDocRef = doc(FIRESTORE_DB, "users", currentUser.uid);
      const mealPlanDocSnapshot = await getDoc(mealPlanDocRef);

      if (mealPlanDocSnapshot.exists()) {
        const mealPlanData = mealPlanDocSnapshot.data().mealPlan || {};
        const mealPlanRecipes = mealPlanData.recipes || [];

        setMealPlanItems(mealPlanRecipes);

        const detailsPromises = mealPlanRecipes.map(async (item) => {
          const response = await axios.get(
            `https://api.spoonacular.com/recipes/${item.recipeId}/information?apiKey=${process.env.REACT_APP_API_KEY}`
          );
          return response.data;
        });

        const detailedMeals = await Promise.all(detailsPromises);
        setDetailedMealPlan(detailedMeals);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const removeFromSaved = async (recipeId) => {
    try {
      const userDocRef = doc(FIRESTORE_DB, "users", currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);
      const mealPlan = userDocSnapshot.data().mealPlan || { recipes: [] };
      const updatedMealPlan = {
        recipes: mealPlan.recipes.filter(
          (recipe) => recipe.recipeId !== recipeId
        ),
      };

      await deleteDoc(userDocRef);
      await setDoc(userDocRef, { mealPlan: updatedMealPlan }, { merge: true });

      console.log("Recipe removed from meal plan:", recipeId);

      fetchAllData();
    } catch (error) {
      console.error("Error removing from meal plan:", error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [currentUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap w-full mb-20">
            <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
              <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-white">
                These are the recipes you have saved
              </h1>
              <div className="h-1 w-20 bg-indigo-500 rounded"></div>
            </div>
          </div>
          <div className="flex flex-wrap -m-4">
            {detailedMealPlan.map((recipe) => (
              <div key={recipe.id} className="xl:w-1/4 md:w-1/2 p-4">
                <div className="bg-gray-100 p-6 rounded-lg">
                  <img
                    className="h-40 rounded w-full object-cover object-center mb-6"
                    src={recipe.image}
                    alt={recipe.title}
                  />
                  <h3 className="tracking-widest text-indigo-500 text-xs font-medium title-font"></h3>
                  <Link to={`/random-recipe/${recipe.id}`}>
                    <h2 className="text-lg text-gray-900 font-medium title-font mb-4">
                      {recipe.title}
                    </h2>
                  </Link>
                  <p className="leading-relaxed text-base">
                    Time Taken to cook this dish: {recipe.readyInMinutes}{" "}
                    minutes
                  </p>
                  <p className="leading-relaxed text-base">
                    Servings: {recipe.servings}
                  </p>

                  {recipe.nutrition && (
                    <div className="nutrient-info">
                      <p>Calories: {recipe.nutrition.calories.toFixed(2)}</p>
                      <p>Carbohydrates: {recipe.nutrition.carbs.toFixed(2)}</p>
                      <p>Fat: {recipe.nutrition.fat.toFixed(2)}</p>
                      <p>Protein: {recipe.nutrition.protein.toFixed(2)}</p>
                    </div>
                  )}

                  <Link to={`/random-recipe/${recipe.id}`}>
                    <button className="button viewRecipeButton">
                      <span className="buttonText">View Recipe</span>
                    </button>
                  </Link>

                  {/* Remove from Saved Button */}
                  <button
                    className="button removeFromSavedButton"
                    onClick={() => removeFromSaved(recipe.id)}
                  >
                    <span className="buttonText">Remove from Saved</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MealPlanner;
