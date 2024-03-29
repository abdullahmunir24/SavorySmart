import React, { useEffect, useState } from "react";
import "./Random.css";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import Header from "./header";

export default function IngredientRecipes() {
  const { ingredients } = useParams();
  const navigate = useNavigate();
  const [ingred, setIngred] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ingredients) {
      return;
    }

    async function fetchRecipes() {
      try {
        const { data } = await axios.get(
          `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=9&apiKey=${process.env.REACT_APP_API_KEY_meal}`
        );
        console.log(data);
        setIngred(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setIngred([]);
        setLoading(false);
      }
    }

    fetchRecipes();
  }, [ingredients]);

  return (
    <div>
      <Header />
      {loading && <div>Loading...</div>}
      {!loading && (
        <div>
          {ingred.length === 0 ? (
            <div className="text-3xl font-medium mb-2 text-white">
              Sorry, cannot find recipes for this ingredient. Try searching
              again.
            </div>
          ) : (
            <div className="work-list">
              {ingred.map((recipe) => (
                <div className="work" key={recipe.id}>
                  <img src={recipe.image} alt={recipe.title} />
                  <div className="layer">
                    <h3>{recipe.title}</h3>
                    <h4 style={{ color: "blue" }}>Used Ingredients:</h4>
                    <ul style={{ color: "white" }}>
                      {recipe.usedIngredients.map((ingredient) => (
                        <li key={ingredient.id}>{ingredient.name}</li>
                      ))}
                    </ul>
                    <Link to={`/random-recipe/${recipe.id}`}>
                      <button
                        className="button"
                        style={{ width: "120px", margin: "-10px 0 0 -20px" }}
                      >
                        <span className="buttonText">View Recipe</span>
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
