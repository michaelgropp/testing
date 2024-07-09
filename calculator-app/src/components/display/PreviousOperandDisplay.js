import React from "react";
import './display.css';

const PreviousOperandDisplay = ({ value }) => {
    return (
        <div className='previous-operand-display'>
            {value}
        </div>
    )
}


export default PreviousOperandDisplay;