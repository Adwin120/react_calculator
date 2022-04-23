import React, { useEffect, useRef, useState } from "react";
import {CalculatorKeyboard} from "./CalculatorKeyboard";
import "./Calculator.scss"
import {CalculatorDisplay, createEmptyInputState} from "./CalculatorDisplay"
import { Editor, EditorState, Modifier } from "draft-js";

type calculatorMode = 'scientific' | 'quadratic';

export default function Calculator() {
    const [mode, setMode] = useState<calculatorMode>('scientific');

    const editorRef = useRef<Editor>(null);
    const [inputState, setInputState] = useState(createEmptyInputState);

    const handleModeChange = (e: React.ChangeEvent<HTMLInputElement>) => setMode(e.target.value as calculatorMode)
    const typeToInput = (keyValue: string) => () => {
        editorRef.current?.focus();
        const contentState = inputState.getCurrentContent();
        const selection = inputState.getSelection();
        const contentStateAfterInsertion = Modifier.replaceText(
            contentState,
            selection,
            keyValue
        );
        const newSelection = contentStateAfterInsertion.getSelectionAfter()
        const newState = EditorState.push(
            inputState,
            contentStateAfterInsertion,
            "insert-characters"
        );
        const dupa = EditorState.forceSelection(
            newState,
            newSelection
        )
        setInputState(dupa);
    }
    return (
        <>
            <CalculatorDisplay inputState={inputState} onChange={setInputState} ref={editorRef}/>
            <div>
                <input type="radio" id="scientificModeRadio" checked={mode === "scientific"} value="scientific" onChange={handleModeChange} />
                <label htmlFor="scientificModeRadio">scientific</label>
                <input type="radio" id="quadraticModeRadio" checked={mode === "quadratic"} value="quadratic" onChange={handleModeChange} />
                <label htmlFor="quadraticModeRadio">quadratic equation</label>
                <CalculatorKeyboard handleClick={typeToInput} />
            </div>
        </>
    )
}
