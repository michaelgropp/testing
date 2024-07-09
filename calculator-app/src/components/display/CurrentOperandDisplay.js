import React from "react";
import './display.css';

const CurrentOperandDisplay = ({ value }) => {
    return (
        <div className="current-operand-display">
            {value}
        </div>
    );
};


export default CurrentOperandDisplay;