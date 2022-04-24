import { useRef, useState } from "react";
import { CalculatorKeyboard } from "./Keyboard";
import "./Calculator.scss"
import { CalculatorDisplay, createEmptyInputState, deleteSelection, moveOutputToInput, typeToInput } from "./Display"
import { Editor } from "draft-js";
import { evaluate } from "mathjs";

export default function Calculator() {

    const editorRef = useRef<Editor>(null);
    const [inputState, setInputState] = useState(createEmptyInputState);

    const handleInput = (keyValue: string) => () => {
        editorRef.current?.focus();
        setInputState(currentState => typeToInput(currentState, keyValue));
    }
    const handleReturn = () => {
        editorRef.current?.focus();
        const input = inputState.getCurrentContent().getPlainText();
        const output = evaluate(input);
        setInputState(currentState => moveOutputToInput(currentState, output));
    }

    const handleClear = () => {
        editorRef.current?.focus();
        setInputState(createEmptyInputState)
    }

    const handleBackspace = () => {
        editorRef.current?.focus();
        setInputState(currentState => deleteSelection(currentState));
    }

    return (
        <>
            <CalculatorDisplay inputState={inputState} onChange={setInputState} ref={editorRef} />
            <div>
                {/* additional user input could go here */}
                <CalculatorKeyboard
                    handleInput={handleInput}
                    handleReturn={handleReturn}
                    handleBackspace={handleBackspace}
                    handleClear={handleClear}
                />
            </div>
        </>
    )
}
