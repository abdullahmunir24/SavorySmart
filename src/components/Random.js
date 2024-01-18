import axios from "axios";
import { useEffect, useState } from "react";
import "./Random.css";
import { Link, useNavigate } from "react-router-dom";
import "./Registration.css";

export default function Random() {
  const [randomRecipes, setRandomRecipes] = useState([]);
  const navigate = useNavigate();

  const handleRandom = (recipeId) => {
    navigate(`/random-recipe/${recipeId}`);
  };

  async function fetchRandomRecipes() {
    try {
      const { data } = await axios.get(
        `https://api.spoonacular.com/recipes/random?apiKey=${process.env.REACT_APP_API_KEY_random}&number=9`
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
  );
}
