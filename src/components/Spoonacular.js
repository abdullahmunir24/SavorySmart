import axios from "axios";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../FirebaseConfig";

export const connectUserToSpoonacular = async (userData) => {
  try {
    const response = await axios.post(
      "https://api.spoonacular.com/users/connect",
      userData,
      {
        params: {
          apiKey: `${process.env.REACT_APP_API_KEY}`,
        },
      }
    );

    const { username, spoonacularPassword, hash } = response.data;

    const { currentUser } = FIREBASE_AUTH;
    const userDocRef = doc(FIRESTORE_DB, "users", currentUser.uid);

    // Update user data (firstName, lastName, email) or add additional fields as needed
    await setDoc(
      userDocRef,
      {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
      },
      { merge: true }
    );

    // Create or update the "spoonacular" map
    await setDoc(
      userDocRef,
      { spoonacular: { hash, spoonacularPassword, username } },
      { merge: true }
    );

    return { username, spoonacularPassword, hash };
  } catch (error) {
    console.error(
      "Error connecting user to Spoonacular:",
      error.message || error
    );
    throw error;
  }
};
