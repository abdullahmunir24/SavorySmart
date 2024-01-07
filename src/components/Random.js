import axios from "axios";
import { useEffect, useState } from "react";
import "./Random.css";
import { Link, useNavigate } from "react-router-dom";
import { addDoc, collection, getDoc, doc, setDoc } from "firebase/firestore";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../FirebaseConfig";

export default function Random() {
  const [randomRecipes, setRandomRecipes] = useState([]);
  const navigate = useNavigate();

  const handleRandom = (recipeId) => {
    navigate(`/random-recipe/${recipeId}`);
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

  async function fetchRandomRecipes() {
    try {
      const { data } = await axios.get(
        `https://api.spoonacular.com/recipes/random?apiKey=${process.env.REACT_APP_API_KEY}&number=6&tags=vegetarian,dessert`
      );
      setRandomRecipes(data.recipes);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchRandomRecipes();
  }, []);

  return (
    <div className="work-list">
      {randomRecipes.map((recipe) => (
        <div className="work" key={recipe.id}>
          <img src={recipe.image} alt={recipe.title} />
          <div className="layer">
            <h3>{recipe.title}</h3>
            <p>Additional details or description of the recipe</p>
            <Link to={`/random-recipe/${recipe.id}`}>
              <i className="fas fa-external-link-alt"></i>
            </Link>
            <i
              onClick={() => handleRandom(recipe.id)}
              className="fas fa-external-link-alt"
            ></i>
            <button onClick={() => addRecipeToMealPlan(recipe)}>
              Add to Meal Plan
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
