import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./header.css";

export default function Header() {
  const [word, setWord] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/searched-recipe/${word}`);
  };

  const handleIngSearch = () => {
    navigate(`/searchedByIngredient-recipe/${ingredients}`);
  };

  const handleChange = (event) => {
    setWord(event.target.value);
  };

  const handleIngChange = (event) => {
    setIngredients(event.target.value);
  };

  const handleRegisterUser = () => {
    navigate("/register-user");
  };

  const handleLoginUser = () => {
    navigate("/login");
  };

  const handlehome = () => {
    navigate("/");
  };

  const handleabout = () => {
    navigate("/");
  };

  const handledaily = () => {
    navigate("/generate-day-meal-plan");
  };

  const handleweekly = () => {
    navigate("/generate-week-meal-plan");
  };

  const handlesaved = () => {
    navigate("/mealplanner");
  };

  const handlerestuarant = () => {
    navigate("/restaurant");
  };

  const handlecontact = () => {
    navigate("/contact");
  };

  return (
    <header
      className="text-gray-400 bg-gray-900 body-font responsive-header"
      style={{ marginBottom: "-100px" }}
    >
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center">
            <button
              onClick={handlehome}
              className="inline-flex items-center bg-gray-800 border-0 py-1 px-3 focus:outline-none hover:bg-gray-700 rounded-lg text-base"
            >
              Home
            </button>

            <button
              onClick={handledaily}
              className="inline-flex items-center bg-gray-800 border-0 py-1 px-3 focus:outline-none hover:bg-gray-700 rounded-lg text-base ml-4"
            >
              Daily Meal Plan
            </button>
            <button
              onClick={handleweekly}
              className="inline-flex items-center bg-gray-800 border-0 py-1 px-3 focus:outline-none hover:bg-gray-700 rounded-lg text-base ml-4"
            >
              Weekly Meal Plan
            </button>
            <button
              onClick={handlesaved}
              className="inline-flex items-center bg-gray-800 border-0 py-1 px-3 focus:outline-none hover:bg-gray-700 rounded-lg text-base ml-4"
            >
              Your Dashboard
            </button>
            <button
              onClick={handlerestuarant}
              className="inline-flex items-center bg-gray-800 border-0 py-1 px-3 focus:outline-none hover:bg-gray-700 rounded-lg text-base ml-4"
            >
              Restaurant Search
            </button>
            <div className="relative ml-4">
              <button
                onClick={handlecontact}
                className="inline-flex items-center bg-gray-800 border-0 py-1 px-3 focus:outline-none hover:bg-gray-700 rounded-lg text-base"
              >
                Contact Developer
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center mt-4">
          <div className="flex">
            <input
              type="search"
              placeholder="Search Recipe"
              name="searchbar"
              value={word}
              onChange={handleChange}
              className="bg-gray-800 rounded-lg focus:outline-none focus:bg-white focus:text-gray-900 w-full md:w-auto mb-3 md:mb-0 mr-2"
            />
            <button
              onClick={handleSearch}
              className="inline-flex items-center bg-gray-800 border-0 py-1 px-3 focus:outline-none hover:bg-gray-700 rounded-lg text-base"
            >
              Search
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-4 h-4 ml-1"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>

          <div className="flex ml-2">
            <input
              type="search"
              placeholder="Type ingredients e.g.apples"
              name="searchbar-ingredients"
              value={ingredients}
              onChange={handleIngChange}
              className="bg-gray-800 rounded-lg focus:outline-none focus:bg-white focus:text-gray-900 w-full md:w-auto mb-3 md:mb-0 mr-2"
            />
            <button
              onClick={handleIngSearch}
              className="inline-flex items-center bg-gray-800 border-0 py-1 px-3 focus:outline-none hover:bg-gray-700 rounded-lg text-base"
            >
              Search by ingredients
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-4 h-4 ml-1"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>

        <div className="flex items-center mt-4">
          <button
            onClick={handleRegisterUser}
            className="inline-flex items-center bg-gray-800 border-0 py-2 px-4 focus:outline-none hover:bg-gray-700 rounded-lg text-base mr-2"
          >
            Sign Up
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-4 h-4 ml-1"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </button>
          <div className="flex items-center">
            <div className="mr-2"></div>{" "}
            <button
              onClick={handleLoginUser}
              className="inline-flex items-center bg-gray-800 border-0 py-2 px-4 focus:outline-none hover:bg-gray-700 rounded-lg text-base"
            >
              Login
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-4 h-4 ml-1"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>

        {searchResults.length > 0 && (
          <div className="container mx-auto">
            <ul>
              {searchResults.map((result) => (
                <li onClick={handleSearch} key={result.id}>
                  {result.title}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
