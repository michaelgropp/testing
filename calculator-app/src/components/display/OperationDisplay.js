import React from "react";
import './display.css';

const OperationDisplay = ({ value }) => {
    return (
        <div className="operation-display">
            {value}
        </div>
    );
};


export default OperationDisplay;