import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import RandomRecipe from "./components/RandomRecipe";
import Home from "./components/Home";
import DisplayedRecipes from "./components/displayedRecipes";
import IngredientRecipes from "./components/IngredientRecipes";
import LoginView from "./components/LoginView";
import Registration from "./components/Registration";
import MealPlanner from "./components/MealPlanner";
import GenerateDailyMealPlan from "./components/GenerateDailyMealPLan";
import WeeklyMealPlan from "./components/WeeklyMealPlan";
import Restaurant from "./components/Restaurant";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/random-recipe/:id" element={<RandomRecipe />} />
        <Route path="/searched-recipe/:word" element={<DisplayedRecipes />} />
        <Route path="/register-user" element={<Registration />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/mealplanner" element={<MealPlanner />} />
        <Route path="/restaurant" element={<Restaurant />} />

        <Route
          path="/generate-day-meal-plan"
          element={<GenerateDailyMealPlan />}
        />
        <Route path="/generate-week-meal-plan" element={<WeeklyMealPlan />} />

        <Route path="/" element={<Home />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />

        <Route
          path="/searchedByIngredient-recipe/:ingredients"
          element={<IngredientRecipes />}
        />
      </Routes>
    </Router>
  );
}

export default App;
