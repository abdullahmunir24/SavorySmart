import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./header";

const Restaurant = () => {
  const [cuisine, setCuisine] = useState("Italian");
  const [restaurants, setRestaurants] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState("Italian");
  const [loading, setLoading] = useState(true);

  const cuisines = [
    "African",
    "Asian",
    "American",
    "British",
    "Cajun",
    "Caribbean",
    "Chinese",
    "Eastern European",
    "European",
    "French",
    "German",
    "Greek",
    "Indian",
    "Irish",
    "Italian",
    "Japanese",
    "Jewish",
    "Korean",
    "Latin American",
    "Mediterranean",
    "Mexican",
    "Middle Eastern",
    "Nordic",
    "Southern",
    "Spanish",
    "Thai",
    "Vietnamese",
  ];

  const handleSearch = async () => {
    try {
      setLoading(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;

          const response = await axios.get(
            "https://api.spoonacular.com/food/restaurants/search",
            {
              params: {
                cuisine: selectedCuisine,
                lat: latitude,
                lng: longitude,
                apiKey: `${process.env.REACT_APP_API_KEY_rest}`,
              },
            }
          );

          setRestaurants(response.data.restaurants);
          setLoading(false);
        });
      } else {
        console.error("Geolocation is not supported by this browser.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error searching for restaurants:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [selectedCuisine]);

  return (
    <div>
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-4 text-white">
          Search Restaurants
        </h1>

        <div className="mb-4">
          <h3>Cuisine:</h3>
          <select
            value={selectedCuisine}
            onChange={(e) => setSelectedCuisine(e.target.value)}
            className="border border-gray-400 p-2 w-full"
          >
            {cuisines.map((cuisine) => (
              <option key={cuisine} value={cuisine}>
                {cuisine}
              </option>
            ))}
          </select>
        </div>

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleSearch}
        >
          Search
        </button>

        <div className="mt-8">
          {loading ? (
            <p className="text-white font-bold">Loading...</p>
          ) : restaurants.length > 0 ? (
            restaurants.map((restaurant) => (
              <div key={restaurant._id} className="mb-8">
                <h2 className="text-2xl font-bold">{restaurant.name}</h2>
                <p className="text-white">{restaurant.description}</p>
                <p className="text-white">
                  Rating: {restaurant.weighted_rating_value}
                </p>
                <p className="text-white">
                  Distance: {restaurant.miles.toFixed(2)} miles
                </p>
                <p className="text-white">
                  Address: {restaurant.address.street_addr},{" "}
                  {restaurant.address.city}
                </p>
                <p className="text-white">
                  Operational Hours: <br />
                  {Object.entries(restaurant.local_hours.operational).map(
                    ([day, hours]) => (
                      <span key={day}>
                        {day}: {hours} &nbsp;
                        <br />
                      </span>
                    )
                  )}
                </p>
              </div>
            ))
          ) : (
            <p className="text-white font-bold">
              Sorry, we can't find any restaurants nearby serving{" "}
              {selectedCuisine} cuisine. Please try with another cuisine.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Restaurant;
