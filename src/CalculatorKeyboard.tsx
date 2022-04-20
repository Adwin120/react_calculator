import React from "react";
import "./Calculator.scss"
type stateSetter<T> = React.Dispatch<React.SetStateAction<T>>;
interface CalculatorKeyboardProps {
    updateExpression: (callback: (leftPart: string, selection: string, rightPart: string) => string) => void
}
export const CalculatorKeyboard: React.FC<CalculatorKeyboardProps> = ({updateExpression }) => {
    const appendToValue = (element: string) => () => updateExpression((left, selection, right) => left + element + right);

    const digits = ["7", "8", "9", "4", "5", "6", "1", "2", "3"];
    const operators = ["^", "/", "*", "-", "+", "="];
    const functions = ["abs", "sin", "cos", "sqrt", "ln", "tg"];
    const navigation = ["left", "right", "M+", "M-", "+-", "C", "CE", "back"]
    const lastRow = ["0", "."];


    return (
        <div className="calculator-keyboard">
            <ButtonList values={navigation} cName="navigation-key" clickAction={appendToValue} />
            <ButtonList values={functions} cName="function-key" clickAction={appendToValue} />
            <ButtonList values={digits} cName="digit-key" clickAction={appendToValue} />
            <ButtonList values={operators} cName="operator-key" clickAction={appendToValue} />
            <ButtonList values={lastRow} cName="bottom-row-key" clickAction={appendToValue} />
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