import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function Header() {
  const [word, setWord] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/searched-recipe/${word}`);
  };

  const handleChange = (event) => {
    setWord(event.target.value);
  };

  useEffect(() => {
    async function fetchAutocompleteResults() {
      if (!word) return;

      try {
        const { data } = await axios.get(`https://api.spoonacular.com/recipes/autocomplete?number=10&query=${word}&apiKey=${process.env.REACT_APP_API_KEY}`);
        setSearchResults(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchAutocompleteResults();
  }, [word]);

  return (
    <header className="text-gray-400 bg-gray-900 body-font">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <input
          type="search"
          placeholder="Search Recipe"
          name="searchbar"
          value={word}
          onChange={handleChange}
          className="bg-gray-800 rounded-lg focus:outline-none focus:bg-white focus:text-gray-900 w-full md:w-auto mb-3 md:mb-0"
        />
        <button
          onClick={handleSearch}
          className="inline-flex items-center bg-gray-800 border-0 py-1 px-3 focus:outline-none hover:bg-gray-700 rounded-lg text-base mt-4 md:mt-0"
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
      {searchResults.length > 0 && (
        <div className="container mx-auto">
          <ul>
            {searchResults.map((result) => (
              <li onClick={handleSearch} key={result.id}>{result.title}</li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
