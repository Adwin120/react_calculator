import { useRef, useState } from "react";
import { CalculatorKeyboard } from "./Keyboard";
import "./Calculator.scss"
import { CalculatorDisplay, createEmptyInputState } from "./Display"
import { Editor, EditorState, Modifier } from "draft-js";

export default function Calculator() {

    const editorRef = useRef<Editor>(null);
    const [inputState, setInputState] = useState(createEmptyInputState);

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
        const newEditorState = EditorState.push(
            inputState,
            contentStateAfterInsertion,
            "insert-characters"
        );
        const editorStateAfterSelectionFix = EditorState.forceSelection(
            newEditorState,
            newSelection
        );
        setInputState(editorStateAfterSelectionFix);
    }
    return (
        <>
            <CalculatorDisplay inputState={inputState} onChange={setInputState} ref={editorRef} />
            <div>
                {/* additional user input could go here */}
                <CalculatorKeyboard
                    typeToInput={typeToInput}
                    handleReturn={()=>{}}
                    handleBackspace={()=>{}}
                    handleClear={()=>{}}
                />
            </div>
        </>
    )
}
