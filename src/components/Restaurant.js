import React, { useState } from "react";
import axios from "axios";

const Restaurant = () => {
  const [cuisine, setCuisine] = useState("");
  const [restaurants, setRestaurants] = useState([]);

  const handleSearch = async () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;

          const response = await axios.get(
            "https://api.spoonacular.com/food/restaurants/search",
            {
              params: {
                cuisine,
                lat: latitude,
                lng: longitude,
                apiKey: `${process.env.REACT_APP_API_KEY}`,
              },
            }
          );

          setRestaurants(response.data.restaurants);
        });
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    } catch (error) {
      console.error("Error searching for restaurants:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Search Restaurants</h1>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Cuisine:
        </label>
        <input
          type="text"
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
          className="border border-gray-400 p-2 w-full"
        />
      </div>

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleSearch}
      >
        Search
      </button>

      <div className="mt-8">
        {restaurants.map((restaurant) => (
          <div key={restaurant._id} className="mb-8">
            <h2 className="text-2xl font-bold">{restaurant.name}</h2>
            <p className="text-gray-600">{restaurant.description}</p>
            <p className="text-gray-600">
              Rating: {restaurant.weighted_rating_value}
            </p>
            <p className="text-gray-600">
              Distance: {restaurant.miles.toFixed(2)} miles
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Restaurant;
