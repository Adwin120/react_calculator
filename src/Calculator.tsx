import React, { useState } from "react";
import {CalculatorKeyboard} from "./CalculatorKeyboard";
// import evaluateExpression from "./utils/expressionTree";
import "./Calculator.scss"

type calculatorMode = 'scientific' | 'quadratic';

export default function Calculator() {
    const [mode, setMode] = useState<calculatorMode>('scientific');
    const [expression, setExpression] = useState("expression");
    const [value, setValue] = useState("value");

    const handleModeChange = (e: React.ChangeEvent<HTMLInputElement>) => setMode(e.target.value as calculatorMode)

    return (
        <>
            <div className="calculatorDisplay expressionDisplay">{expression}</div>
            <div className="calculatorDisplay valueDisplay">{value}</div>
            <div>
                <input type="radio" id="scientificModeRadio" checked={mode === "scientific"} value="scientific" onChange={handleModeChange} />
                <label htmlFor="scientificModeRadio">scientific</label>
                <input type="radio" id="quadraticModeRadio" checked={mode === "quadratic"} value="quadratic" onChange={handleModeChange} />
                <label htmlFor="quadraticModeRadio">quadratic equation</label>
                <CalculatorKeyboard setValue={setValue} />
            </div>
        </>
    )
}
