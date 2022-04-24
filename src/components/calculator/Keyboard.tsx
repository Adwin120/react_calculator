import React from "react";
import "./Calculator.scss"

interface CalculatorKeyboardProps {
    handleClick: (keyValue: string) => () => void
}
export const CalculatorKeyboard: React.FC<CalculatorKeyboardProps> = ({ handleClick }) => {
    
    const digits = ["7", "8", "9", "4", "5", "6", "1", "2", "3"];
    const operators = ["^", "/", "*", "-", "+", "="];
    const functions = ["abs", "sin", "cos", "sqrt", "ln", "tg"];
    const navigation = ["(", ")","C", "back"]
    const lastRow = ["0", ".",];
    
    

    return (
        <div className="calculator-keyboard">
            <ButtonList values={navigation} cName="navigation-key" clickAction={handleClick} />
            <ButtonList values={functions} cName="function-key" clickAction={handleClick} />
            <ButtonList values={digits} cName="digit-key" clickAction={handleClick} />
            <ButtonList values={operators} cName="operator-key" clickAction={handleClick} />
            <ButtonList values={lastRow} cName="bottom-row-key" clickAction={handleClick} />
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