import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import RandomRecipe from './components/RandomRecipe';
import Home from './components/Home'
import DisplayedRecipes from './components/displayedRecipes'
import IngredientRecipes from './components/IngredientRecipes';

function App() {
  return (
    <Router>
        <Routes>
        <Route path="/random-recipe/:id" element={<RandomRecipe />} />
        <Route path="/searched-recipe/:word" element={<DisplayedRecipes />} />
        <Route path="/searchedByIngredient-recipe/:ingredients" element={<IngredientRecipes />} />
          <Route path="/" element={<Home/>} />
        </Routes>
      </Router>
  
  );
}

export default App;
