import React from "react";
import "./InputStuff.css";

function InputStuff(props) {
  const { text, title, placeholder, isSecure, onChangeText } = props;

  return (
    <div>
      <label className="title">{title}</label>
      {isSecure ? (
        <input
          type="password"
          placeholder={placeholder}
          value={text}
          onChange={(e) => onChangeText(e.target.value)}
          className="input"
        />
      ) : (
        <input
          type="text"
          placeholder={placeholder}
          value={text}
          onChange={(e) => onChangeText(e.target.value)}
          className="input"
        />
      )}
      <div className="divider" />
    </div>
  );
}

export default InputStuff;
