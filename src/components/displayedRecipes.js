import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Random.css";

export default function DisplayedRecipes() {
  const [searchedRecipes, setSearchedRecipes] = useState([]);
  const { word } = useParams();
  const navigate = useNavigate;

  const handleDetails = (recipeId) => {
    navigate(`/random-recipe/${recipeId}`);
  };

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const { data } = await axios.get(
          `https://api.spoonacular.com/recipes/complexSearch?query=${word}&number=3 &apiKey=${process.env.REACT_APP_API_KEY}`
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
      <div className="work-list">
        {searchedRecipes.map((recipe) => (
          <div className="work" key={recipe.id}>
            <img src={recipe.image} alt={recipe.title} />
            <div className="layer">
              <h3>{recipe.title}</h3>
              <p>Additional details or description of the recipe</p>
              <Link to={`/random-recipe/${recipe.id}`}>
                <i className="fas fa-external-link-alt"></i>
              </Link>
              <i
                onClick={handleDetails}
                className="fas fa-external-link-alt"
              ></i>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
