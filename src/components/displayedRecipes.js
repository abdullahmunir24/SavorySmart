import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import "./Random.css";
import Header from "./header";

export default function DisplayedRecipes() {
  const [searchedRecipes, setSearchedRecipes] = useState([]);
  const { word } = useParams();
  const navigate = useNavigate();

  const handleDetails = (recipeId) => {
    navigate(`/random-recipe/${recipeId}`);
  };

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const { data } = await axios.get(
          `https://api.spoonacular.com/recipes/complexSearch?query=${word}&number=6&apiKey=${process.env.REACT_APP_API_KEY_meal}`
        );
        setSearchedRecipes(data.results);
      } catch (error) {
        console.log(error);
      }
    }
    fetchRecipes();
  }, [word]);

  return (
    <div>
      <Header />
      <div className="work-list">
        {searchedRecipes.map((recipe) => (
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
    </div>
  );
}
