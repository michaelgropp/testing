import React, { useEffect, useState } from "react";
import CurrentOperandDisplay from "../display/CurrentOperandDisplay";
import Button from "../button/Button";
import './calculator.css'
import PreviousOperandDisplay from "../display/PreviousOperandDisplay";
import OperationDisplay from "../display/OperationDisplay";


const Calculator = () => {
    const [previousOperand, setPreviousOperand] = useState([]);
    const [currentOperand, setCurrentOperand] = useState([]);
    const [operation, setOperation] = useState(null);
    const [memory, setMemory] = useState(0);
    const [isAnswer, setIsAnswer] = useState(false);


    const handleClick = (label) => {
        if(isThisANumber(label) || label === '.') {
            if (label === '.' && currentOperand.includes('.')) {
                return;
            }
            if (label === '.' && currentOperand.length === 0) {
                setCurrentOperand(['0', '.']);
            } else {
                setCurrentOperand([...currentOperand, label]);
            }
        } else if (isThisAnOperation(label)) {
            if (currentOperand.length > 0 && previousOperand.length > 0 && operation) {
                const result = calculateResult(previousOperand, currentOperand, operation);
                    if (result !== undefined) {
                        setPreviousOperand([result.toString()]);
                        setCurrentOperand([]);
                        setOperation(label);
                    }
            } else if (currentOperand.length > 0) {
                    setPreviousOperand(currentOperand);
                    setCurrentOperand([]);
                    setOperation(label);
            }
        } else if (label === '=') {
            if(previousOperand.length > 0 && currentOperand.length > 0) {
                const result = calculateResult(previousOperand, currentOperand, operation);
                if (result !== undefined) {
                  setCurrentOperand([result.toString()]);
                  setPreviousOperand([]);
                  setOperation(null);
                  setIsAnswer(true);
                }
            }
        } else if (isThisASpecialOperation(label)) {
            if (label === 'x²') {
                setCurrentOperand([(Math.pow(Number(currentOperand.join('')), 2)).toString()]);
                setIsAnswer(true);
            } else if (label === '√') {
                setCurrentOperand([(Math.sqrt(Number(currentOperand.join('')))).toString()])
                setIsAnswer(true)
            } else if (label === '+/−') {
                if (currentOperand.length > 0) {
                    setCurrentOperand([(currentOperand.join('') * -1).toString()]);
                } else {
                    return;
                }
            }

            let result;
            const currentValue = Number(currentOperand.join(''));
            
            if (label === 'x²') {
                result = Math.pow(currentValue, 2);
            } else if (label === '√') {
                result = Math.pow(currentValue, 1 / 2);
            } else if (label === '+/−') {
                result = currentValue * -1;
            }

            setCurrentOperand([roundNumber(result)]);
        } else if (label === 'AC') {
            setPreviousOperand([]);
            setCurrentOperand([]);
            setOperation(null);
        } else if (label === 'DEL') {
            setCurrentOperand(currentOperand.slice(0, -1));
        } else if (label === 'MC') {
            setMemory(0);
        } else if (label === 'MR') {
            setCurrentOperand([memory.toString()]);
            setIsAnswer(true);
        } else if (label === 'M+') {
            setMemory(memory + parseFloat(currentOperand.join('')));
        } else if (label === 'M-') {
            setMemory(memory - parseFloat(currentOperand.join('')));
        } else if (label === 'MS') {
            setMemory(parseFloat(currentOperand.join('')));
        }
    };

    const handleNewClick = (e, label) => {
        if(e.target.classList.contains('digit-button')) {
            setCurrentOperand(prevCurrentOperand => [prevCurrentOperand.splice(0,currentOperand.length), label])
            setIsAnswer(false);
           // return console.log('Digit Button Pressed', label);
        } else if (e.target.classList.contains('clear-button')) {
            setCurrentOperand([]);
            setPreviousOperand([]);
            setOperation([]);
            setIsAnswer(false);
           // return console.log('Clear Button Pressed', label);
        } else if (e.target.classList.contains('delete-button')) {
            setCurrentOperand([]);
            setPreviousOperand([]);
            setOperation([]);
            setIsAnswer(false);
           // return console.log('Delete Button Pressed', label);
        } else if (e.target.classList.contains('decimal-button')) {
            setCurrentOperand(prevCurrentOperand => [prevCurrentOperand.splice(1,currentOperand.length), ["0."]])
            setIsAnswer(false);
        } else if (e.target.classList.contains('operation-button')){
            setIsAnswer(false);
        } else if (e.target.classList.contains('semi-special-operation-button')) {
            setIsAnswer(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key) {
            //console.log(Key: ${e.key} with keycode ${e.keyCode} has been pressed);
        }

            if(isThisANumber(e.key) || e.key === '.') {
                handleClick(e.key)
            } else if (e.keyCode === 107 || e.shiftKey && e.keyCode === 187) {
                handleClick('+');
            } else if (e.keyCode === 109 || e.keyCode === 189) {
                handleClick('−')
            } else if (e.keyCode === 111 || e.keyCode === 191) {
                handleClick('÷');
            } else if (e.keyCode === 88 || e.keyCode === 106) {
                handleClick('×');
            } else if (e.shiftKey && e.keyCode === 54 || e.keyCode === 38) {
                handleClick('^');
            } else if (e.keyCode === 187 || e.keyCode === 13) {
                handleClick('=');
            } else if (e.shiftKey && e.keyCode === 50) {
                handleClick('x²');
            } else if (e.shiftKey && e.keyCode === 51) {
                handleClick('√');
            } else if (e.shiftKey && e.keyCode === 78) {
                handleClick('+/−');
            } else if (e.keyCode === 67) {
                handleClick('AC');
            } else if (e.keyCode === 8) {
                handleClick('DEL');
            } else if (e.shiftKey && e.keyCode === 76) {
                handleClick('MC');
            } else if (e.shiftKey && e.keyCode === 82) {
                handleClick('MR');
            } else if (e.shiftKey && e.keyCode === 80) {
                handleClick('M+');
            } else if (e.shiftKey && e.keyCode === 81) {
                handleClick('M-');
            } else if (e.shiftKey && e.keyCode === 77) {
                handleClick('MS');
            }
    }

    const handleNewKeyDown = (e) => {
        if(isThisANumber(e.key)) {
            handleNewClick(e, e.key);
            //return console.log('Digit Button Pressed', e.key);
        } else if (e.keyCode === 67) {
            handleNewClick(e, 'AC');
           // return console.log('Clear Button Pressed', e.key);
        } else if (e.keyCode === 8) {
            handleNewClick(e, 'DEL');
            //return console.log('Delete Button Pressed', e.key);
        } else if (e.keyCode === 190) {
            handleNewClick(e, '.');
        } else if (e.keyCode === 107 || e.shiftKey && e.keyCode === 187){
            handleNewClick(e, '+');
        } else if (e.keyCode === 109 || e.keyCode === 189) {
            handleNewClick(e, '−');
        } else if (e.keyCode === 111 || e.keyCode === 191) {
            handleNewClick(e, '÷');
        } else if (e.keyCode === 88 || e.keyCode === 106) {
            handleNewClick(e, '×');
        } else if (e.shiftKey && e.keyCode === 54 || e.keyCode === 38) {
            handleNewClick(e, '^');
        } else if (e.shiftKey && e.keyCode === 50) {
            handleNewClick(e, 'x²');
        } else if (e.shiftKey && e.keyCode === 51) {
            handleNewClick(e, '√');
        }
    }

    useEffect(() => {
        if(isAnswer === false) {
           // console.log('Key Event Listener Added, isAnswer: ', isAnswer)
            document.addEventListener('keydown', handleKeyDown)
        }

        return () => {
            //console.log('Key Event Listener Removed, is Answer:', isAnswer)
            document.removeEventListener('keydown', handleKeyDown)
        }
    })

    useEffect(() => {
        if(isAnswer === true) {
           // console.log('Click Event Listener Added, isAnswer: ', isAnswer)
            document.addEventListener('click', handleNewClick);
           // console.log('New Key Event Listener Added, isAnswer: ', isAnswer)
            document.addEventListener('keydown', handleNewKeyDown);
        }

        return () => {
           // console.log('Click Event Listener Removed, is Answer:', isAnswer)
            document.removeEventListener('click', handleNewClick);
           // console.log('New Key Event Listener Removed, is Answer:', isAnswer)
            document.removeEventListener('keydown', handleNewKeyDown);
        }
    }, [isAnswer])

    const calculateResult = () => {
        const prev = parseFloat(previousOperand.join(''));
        const current = parseFloat(currentOperand.join(''));
        let result;

        switch (operation) {
            case '+':
                result = prev + current;
                break;
            case '−':
                result = prev - current;
                break;
            case '÷':
                if (current === 0) {
                    setCurrentOperand(['Error: Division by zero']);
                    setPreviousOperand([]);
                    setOperation(null);
                    return;
                }
                result = prev / current;
                break;
            case '×':
                result = prev * current;
                break;
            case '^':
                result = Math.pow(prev, current);
                break;
            default:
                return;
        }


        return roundNumber(result);
    };

    const isThisANumber = (value) => {
        return /^\d+$/.test(value);
    }

    const isThisAnOperation = (char) => {
        return ['+', '−', '×', '÷', '^'].includes(char);
    };

    const isThisASpecialOperation = (char) => {
        return ['x²', '√', '+/−'].includes(char)
    };

    const roundNumber = (num) => {
        let decimalPlaces = num.toString().startsWith('0.') ? 11 : 12;
        let rounded = parseFloat(num.toPrecision(decimalPlaces));
    
        // Check to see if rounded number is not a number (NaN)
        if (isNaN(rounded)) {
            return num.toString(); // Returns the original number as a string
        }
    
        if (!num.toString().includes('.') && rounded.toString().includes('.')) {
            rounded = rounded.toString().replace(/\.?0+$/, ''); // If number is not an integer, remove trailing zeros
        }
    
        return rounded;
    };

    return (
        <div className='calculator'>
            <div className='display'>
                <div className="previous-display">
                    <PreviousOperandDisplay value={previousOperand.join('')} />
                    <OperationDisplay value={operation} />
                </div>
                <CurrentOperandDisplay value={currentOperand.join('')} />
            </div>
            <div className="memory-buttons">
                {['MC', 'MR', 'M+', 'M-', 'MS'].map((label) => (
                    <Button key={label} handleClick={() => handleClick(label)}>{label}</Button>
                ))}
            </div>
            <div className='buttons'>
                <Button className='clear-button' handleClick={() => handleClick('AC')}>AC</Button>
                <Button className='delete-button' handleClick={() => handleClick('DEL')}>DEL</Button>
                <Button className='special-operation-button' handleClick={() => handleClick('x²')}>x²</Button>
                <Button className='special-operation-button' handleClick={() => handleClick('√')}>√</Button>
                <Button className='semi-special-operation-button' handleClick={() => handleClick('^')}>x<sup>y</sup></Button>
                <Button className='operation-button' handleClick={() => handleClick('÷')}>÷</Button>
                <Button className='digit-button' value='7' handleClick={() => handleClick('7')}>7</Button>
                <Button className='digit-button' value='8' handleClick={() => handleClick('8')}>8</Button>
                <Button className='digit-button' value='9' handleClick={() => handleClick('9')}>9</Button>
                <Button className='operation-button' handleClick={() => handleClick('×')}>×</Button>
                <Button className='digit-button' value='4' handleClick={() => handleClick('4')}>4</Button>
                <Button className='digit-button' value='5' handleClick={() => handleClick('5')}>5</Button>
                <Button className='digit-button' value='6' handleClick={() => handleClick('6')}>6</Button>
                <Button className='operation-button' handleClick={() => handleClick('−')}>−</Button>
                <Button className='digit-button' value='1' handleClick={() => handleClick('1')}>1</Button>
                <Button className='digit-button' value='2' handleClick={() => handleClick('2')}>2</Button>
                <Button className='digit-button' value='3' handleClick={() => handleClick('3')}>3</Button>
                <Button className='operation-button' handleClick={() => handleClick('+')}>+</Button>
                <Button className='decimal-button' handleClick={() => handleClick('.')}>.</Button>
                <Button className='digit-button' handleClick={() => handleClick('0')}>0</Button>
                <Button className='negative-button' handleClick={() => handleClick('+/−')}>+/−</Button>
                <Button className='equal-button' handleClick={() => handleClick('=')}>=</Button>
            </div>
        </div>
    );
};


export default Calculator;