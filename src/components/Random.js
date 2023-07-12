import axios from 'axios';
import { useEffect, useState } from 'react';
import './Random.css';
import { Link, useNavigate } from 'react-router-dom';

export default function Random() {
  const [randomRecipes, setRandomRecipes] = useState([]);
  const navigate = useNavigate();


  const handleRandom = (recipeId) => {
    navigate(`/random-recipe/${recipeId}`);
  };


  async function fetchRandomRecipes() {
    try {
      const { data } = await axios.get(`https://api.spoonacular.com/recipes/random?apiKey=${process.env.REACT_APP_API_KEY}&number=12&tags=vegetarian,dessert`);
      setRandomRecipes(data.recipes);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchRandomRecipes();
  }, []);

  return (
    <div>
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
              <i onClick={handleRandom} className="fas fa-external-link-alt"></i>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
