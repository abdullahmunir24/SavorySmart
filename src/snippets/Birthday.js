import React, { useState } from "react";
import { format, differenceInYears } from "date-fns";
import { updateDoc, doc } from "firebase/firestore";
import { FIRESTORE_DB } from "../FirebaseConfig";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Birthday.css";

function Birthday({ userId }) {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSave = async () => {
    try {
      if (!selectedDate) {
        return;
      }

      const userRef = doc(FIRESTORE_DB, "users", userId);

      const formattedDate = format(selectedDate, "MM/dd/yyyy");
      const age = differenceInYears(new Date(), selectedDate);

      await updateDoc(userRef, {
        birthday: formattedDate,
        age: age,
      });

      console.log("Selected Date:", selectedDate);
    } catch (error) {
      console.log("Error saving birthday:", error);
    }
  };

  return (
    <div className="container">
      <h3 className="title">Select Your Birthday</h3>
      <div className="datePickerContainer">
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
        />
      </div>
      <button className="saveButton" onClick={handleSave}>
        Save
      </button>
    </div>
  );
}

export default Birthday;
