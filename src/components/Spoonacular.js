import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../FirebaseConfig";

export const connectUserToSpoonacular = async (userData) => {
  try {
    const response = await axios.post(
      "https://api.spoonacular.com/users/connect",
      userData
    );

    const { username, spoonacularPassword, hash } = response.data;

    const { currentUser } = FIREBASE_AUTH;
    const userDocRef = doc(FIRESTORE_DB, "users", currentUser.uid);

    await setDoc(
      userDocRef,
      {
        spoonacular: {
          username,
          spoonacularPassword,
          hash,
        },
      },
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
