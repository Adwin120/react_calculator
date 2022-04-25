import type React from "react";
import "./Calculator.scss"

interface CalculatorKeyboardProps {
    handleInput: (keyValue: string) => () => void,
    handleReturn: () => void,
    handleBackspace: () => void,
    handleClear: () => void
}
export const CalculatorKeyboard: React.FC<CalculatorKeyboardProps> = ({
    handleInput,
    handleReturn,
    handleBackspace,
    handleClear
}) => {
    const digits = ["7", "8", "9", "4", "5", "6", "1", "2", "3"];
    const operators = ["(", ")", "^", "/", "*", "-", "+"];
    const functions = ["abs", "sin", "cos", "sqrt", "log", "tan"];
    
    return (
        <div className="calculator-keyboard">
            <button
                onClick={handleClear}
                className="calculator-button clear-button"
            >C</button>
            <button
                onClick={handleBackspace}
                className="calculator-button backspace-button"
            >back</button>

            <ButtonList values={functions} cName="function-key" clickAction={handleInput} />
            <ButtonList values={digits} cName="digit-key" clickAction={handleInput} />
            <ButtonList values={operators} cName="operator-key" clickAction={handleInput} />

            <button
                onClick={handleInput("0")}
                className="calculator-button button-0-digit"
            >0</button>
            <button
                onClick={handleInput(".")}
                className="calculator-button"
            >.</button>
            <button
                onClick={handleReturn}
                className="calculator-button button-return"
            >=</button>
        </div>
    )
}

interface ButtonListProps {
    values: string[],
    clickAction: (value: string) => (e: React.MouseEvent<HTMLButtonElement>) => void,
    cName: string
};
const ButtonList: React.FC<ButtonListProps> = ({ values, clickAction, cName }) => {
    return (
        <>
            {
                values.map((value, i) => <button
                    onClick={clickAction(value)}
                    key={value}
                    className={`calculator-button ${cName} ${cName}-${i + 1}`}
                >{value}</button>)
            }
        </>
    );
}