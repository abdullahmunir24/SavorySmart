import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "./header";

const RandomRecipe = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [similarData, setSimilarData] = useState([]);
  const [t, setT] = useState("instructions");

  const navigate = useNavigate();

  const handleRandom = (recipeId) => {
    navigate(`/random-recipe/${recipeId}`);
  };

  const extractSummary = (summary) => {
    const firstIndex = summary.indexOf("%");
    const lastIndex = summary.lastIndexOf("%");

    let endIndex = lastIndex === -1 ? firstIndex + 1 : lastIndex + 1;
    const extractedSummary = summary.slice(0, endIndex);

    return `${extractedSummary}.`;
  };

  useEffect(() => {
    async function fetchRecipe() {
      try {
        const { data } = await axios.get(
          `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false&apiKey=${process.env.REACT_APP_API_KEY_meal}`
        );
        const modifiedSummary = extractSummary(data.summary).replace(
          "spoonacular",
          ""
        );
        setRecipe({ ...data, modifiedSummary });
      } catch (error) {
        console.log(error);
      }
    }

    async function fetchSimilarRecipes() {
      try {
        const { data } = await axios.get(
          `https://api.spoonacular.com/recipes/${id}/similar?number=3&apiKey=${process.env.REACT_APP_API_KEY_rest}`
        );
        setSimilar(data);
      } catch (error) {
        console.log(error);
      }
    }

    async function fetchSimilarData() {
      try {
        const similarIds = similar.map((r) => r.id);
        const promises = similarIds.map((similarId) =>
          axios.get(
            `https://api.spoonacular.com/recipes/${similarId}/information?includeNutrition=false&apiKey=${process.env.REACT_APP_API_KEY_display}`
          )
        );
        const responses = await Promise.all(promises);
        const similarRecipesData = responses.map((response) => response.data);
        setSimilarData(similarRecipesData);
      } catch (error) {
        console.log(error);
      }
    }

    fetchRecipe();
    fetchSimilarRecipes();
    if (similar.length > 0) {
      fetchSimilarData();
    }
  }, [id, similar]);

  if (!recipe || !similar || similarData.length !== similar.length) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>
        <Header />
      </div>
      <section className="text-white body-font mt-8">
        <div className="container px-5 py-24 mx-auto flex flex-col">
          <div className="lg:w-4/6 mx-auto">
            <div className="rounded-lg h-64 overflow-hidden">
              <img
                alt="content"
                className="object-cover object-center h-full w-full"
                src={recipe.image}
              />
            </div>
            <div className="flex flex-col sm:flex-row mt-10">
              <div className="sm:w-1/3 text-center sm:pr-8 sm:py-8">
                <div className="flex flex-col items-center text-center justify-center">
                  <h2 className="font-medium title-font mt-4 text-white text-lg">
                    {recipe.title}
                  </h2>
                  <div className="w-12 h-1 bg-indigo-500 rounded mt-2 mb-4"></div>
                  <p className="text-base"></p>
                </div>
              </div>
              <div className="sm:w-2/3 sm:pl-8 sm:py-8 sm:border-l border-gray-200 sm:border-t-0 border-t mt-4 pt-4 sm:mt-0 text-center sm:text-left">
                <div className="flex mb-4">
                  <button
                    className="text-white focus:outline-none"
                    onClick={() => setT("ingredients")}
                  >
                    Ingredients
                  </button>
                  <button
                    className="text-white focus:outline-none ml-6"
                    onClick={() => setT("instructions")}
                  >
                    Nutrients & Instructions
                  </button>
                </div>

                {t === "ingredients" && (
                  <ul>
                    {recipe.extendedIngredients.map(({ id, original }) => (
                      <li key={id}>{original}</li>
                    ))}
                  </ul>
                )}
                {t === "instructions" && (
                  <>
                    <p
                      className="leading-relaxed text-lg mb-4"
                      dangerouslySetInnerHTML={{
                        __html: recipe.modifiedSummary,
                      }}
                    ></p>
                    <p
                      className="leading-relaxed text-lg mb-4"
                      dangerouslySetInnerHTML={{ __html: recipe.instructions }}
                    ></p>
                  </>
                )}
                <a className="text-indigo-500 inline-flex items-center">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-4 h-4 ml-2"
                    viewBox="0 0 24 24"
                  ></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="text-white body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap w-full mb-20">
            <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
              <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-white">
                Check out similar recipes
              </h1>
              <div className="h-1 w-20 bg-indigo-500 rounded"></div>
            </div>
          </div>
          <div className="flex flex-wrap -m-4">
            {similarData.map((r) => (
              <div key={r.id} className="xl:w-1/4 md:w-1/2 p-4">
                <div className="bg-gray-100 p-6 rounded-lg">
                  <img
                    className="h-40 rounded w-full object-cover object-center mb-6 mt-4"
                    src={r.image}
                    alt="content"
                  />
                  <h3 className="tracking-widest text-indigo-500 text-xs font-medium title-font"></h3>
                  <Link to={`/random-recipe/${r.id}`}>
                    <h2
                      className="text-lg text-black font-medium title-font mb-4"
                      onClick={() => handleRandom(r.id)}
                    >
                      {r.title}
                    </h2>
                  </Link>
                  <p className="leading-relaxed text-base text-black">
                    Time Taken to cook this dish: {r.readyInMinutes} minutes
                  </p>
                  <p className="leading-relaxed text-base text-black">
                    Servings: {r.servings}
                  </p>
                  <Link to={`/random-recipe/${r.id}`}>
                    <button
                      className="button"
                      style={{ width: "120px", margin: "10px 0 0 -20px" }}
                    >
                      <span className="buttonText">View Recipe</span>
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default RandomRecipe;
