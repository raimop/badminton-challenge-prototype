import React from "react";
import "./CustomButton.css";

export const CustomButton = ({
  icon = false,
  green = false,
  shadow = false,
  children,
  onClick,
  style
}) => {

  return (
    <button
      className={`custom-button 
      ${green ? "btn-green" : ""} 
      ${shadow ? "btn-shadow" : ""}`}
      onClick={onClick}
      style={style}
    >
      {icon} {children}
    </button>
  );
};
