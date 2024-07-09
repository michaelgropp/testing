import React from "react";
import './button.css';

const Button = ({ handleClick, children, className }) => {
    return (
        <button onClick={handleClick} className={`button ${className || ''}`}>
            {children}
        </button>
    );
};

export default Button;