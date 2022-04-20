import React, { useEffect, useRef, useState } from "react";
import {CalculatorKeyboard} from "./CalculatorKeyboard";
// import evaluateExpression from "./utils/expressionTree";
import "./Calculator.scss"

type calculatorMode = 'scientific' | 'quadratic';

export default function Calculator() {
    const [mode, setMode] = useState<calculatorMode>('scientific');
    const [expression, setExpression] = useState("expression");
    const [value, setValue] = useState("value");

    const expressionInputRef = useRef<HTMLInputElement>(null);
    const updateExpression = (callback: (left: string, selection: string, right:string) => string) => {
        if (expressionInputRef.current === null) return;
        const {selectionStart, selectionEnd} = expressionInputRef.current;
        setExpression(currentExpression => {
            return callback(
                currentExpression.substring(0, selectionStart!),
                currentExpression.substring(selectionStart!, selectionEnd!),
                currentExpression.substring(selectionEnd!)
            )
        })
        expressionInputRef.current.focus();
        expressionInputRef.current.setSelectionRange(selectionStart, selectionEnd);
    }

    useEffect(() => {
        expressionInputRef.current?.setSelectionRange(2,2)
    }, [expression])

    const handleModeChange = (e: React.ChangeEvent<HTMLInputElement>) => setMode(e.target.value as calculatorMode)

    return (
        <>
            <input
                ref={expressionInputRef}
                className="calculatorDisplay expressionDisplay"
                value={expression}
            />
            
            <div className="calculatorDisplay valueDisplay">{value}</div>
            <div>
                <input type="radio" id="scientificModeRadio" checked={mode === "scientific"} value="scientific" onChange={handleModeChange} />
                <label htmlFor="scientificModeRadio">scientific</label>
                <input type="radio" id="quadraticModeRadio" checked={mode === "quadratic"} value="quadratic" onChange={handleModeChange} />
                <label htmlFor="quadraticModeRadio">quadratic equation</label>
                <CalculatorKeyboard updateExpression={updateExpression} />
            </div>
        </>
    )
}
