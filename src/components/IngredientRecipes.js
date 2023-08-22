import React, { useEffect, useState } from 'react';
import './Random.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function IngredientRecipes() {
  const { ingredients } = useParams();
  const navigate = useNavigate();
  const [ingred, setIngred] = useState([]);

  useEffect(() => {
    if (!ingredients) {
      return; 
    }

    async function fetchRecipes() {
      try {
        const { data } = await axios.get(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=10&apiKey=${process.env.REACT_APP_API_KEY}`);
        console.log(data);
        setIngred(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchRecipes();
  }, [ingredients]);

  const handleInformation = (recipeId) => {
    navigate(`/random-recipe/${recipeId}`);
  };

  if (!ingred || ingred.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="work-list">
        {ingred.map((recipe) => (
          <div className="work" key={recipe.id}>
            <img src={recipe.image} alt={recipe.title} />
            <div className="layer">
              <h3>{recipe.title}</h3>
              <p>Used Ingredients:</p>
              <ul>
                {recipe.usedIngredients.map((ingredient) => (
                  <li key={ingredient.id}>{ingredient.name}</li>
                ))}
              </ul>
              <p>Unused Ingredients:</p>
              <ul>
                {recipe.missedIngredients.map((ingredient) => (
                  <li key={ingredient.id}>{ingredient.name}</li>
                ))}
              </ul>
              <Link to={`/random-recipe/${recipe.id}`}>
                <i className="fas fa-external-link-alt"></i>
              </Link>
              <i onClick={() => handleInformation(recipe.id)} className="fas fa-external-link-alt"></i>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
