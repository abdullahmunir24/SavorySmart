import React, { useState, useEffect } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "../FirebaseConfig";
import "./UploadImage.css";

const storage = getStorage();

export default function UploadImage({ userId }) {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    // Add any necessary permissions check for accessing the user's file system
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const uploadPicture = async () => {
    if (uploading || !image) {
      return;
    }

    try {
      setUploading(true);
      setUploadError(null);
      const imageName = `user_${userId}.jpg`;
      const storageRef = ref(storage, `images/${imageName}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.log("Error uploading image:", error);
          setUploading(false);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            // Now, you can store the downloadURL in Firestore under the user's document
            const userRef = doc(FIRESTORE_DB, "users", userId);
            await setDoc(
              userRef,
              { profileImage: downloadURL },
              { merge: true } // Use { merge: true } to merge the new data with existing data in the document
            );

            console.log("Image URL stored in Firestore!");
          } catch (error) {
            console.log("Error storing image URL in Firestore:", error);
          }

          console.log("Image uploaded successfully!");
          setUploading(false);
        }
      );
    } catch (error) {
      console.log("Can't store URL in Firestore:", error);
      setUploading(false);
    }
  };

  return (
    <div className="container">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        disabled={uploading}
      />
      {image && (
        <img
          src={URL.createObjectURL(image)}
          alt="Selected"
          className="selectedImage"
        />
      )}
      <button
        className="uploadButton"
        onClick={uploadPicture}
        disabled={uploading || !image}
      >
        Upload Picture
      </button>
      {uploading && (
        <div className="uploadingContainer">
          <div className="uploadingText">Uploading...</div>
          <div className="uploadProgress">{Math.round(uploadProgress)}%</div>
        </div>
      )}
      {uploadError && <div className="errorText">{uploadError}</div>}
    </div>
  );
}
