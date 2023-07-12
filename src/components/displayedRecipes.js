import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function DisplayedRecipes() {
  const [searchedRecipes, setSearchedRecipes] = useState([]);
  const { word } = useParams();

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const { data } = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?query=${word}&apiKey=${process.env.REACT_APP_API_KEY}`);
        setSearchedRecipes(data.results);
      } catch (error) {
        console.log(error);
      }
    }
    fetchRecipes();
  }, [word]);

  return (
    <div>
      {searchedRecipes.map((recipe) => (
        <div key={recipe.id}>
          <h3>{recipe.title}</h3>
          <img src={recipe.image} alt="Recipe" />
        </div>
      ))}
    </div>
  );
}
