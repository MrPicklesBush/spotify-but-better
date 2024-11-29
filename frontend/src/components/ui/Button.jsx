import React from "react";
import "./button.css";

function Button({ 
  variant = "default", 
  size = "default", 
  className = "", 
  children, 
  ...props 
}) {
  const variantClass = `button ${variant}`;
  const sizeClass = size !== "default" ? size : "";

  return (
    <button className={`${variantClass} ${sizeClass} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default Button;
