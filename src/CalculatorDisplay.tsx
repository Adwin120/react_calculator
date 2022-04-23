import { CompositeDecorator, ContentState, DraftStyleMap, Editor, EditorState, Modifier } from "draft-js";
import "draft-js/dist/Draft.css";
import React from "react";

interface Props {
    inputState: EditorState,
    onChange: (state: EditorState) => void
}

export const CalculatorDisplay = React.forwardRef<Editor, Props>(({ inputState, onChange }, ref) => {

    return (
        <div className="calculatorDisplay">
            <Editor
                editorState={inputState}
                onChange={onChange}
                textAlignment="right"
                ref={ref}
                keyBindingFn={inputKeyBindings}
            />
            <output className="valueDisplay">output</output>
        </div>
    );
});

const inputKeyBindings = (e: React.KeyboardEvent<{}>) => {
    const {key} = e;
    console.log(key)
    switch (key) {
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowUp":
        case "ArrowRight":
        case "Backspace":
            //fall through to default
            return null
    }
    return "handled"
}

//TODO major failure, change this template to apply diffrent colors to operators
const caret: React.FC<{offsetKey: string}> = ({offsetKey}) => {
    return (
        <span data-offset-key={offsetKey}>test</span>
    )
}

const customCaretDecorator = new CompositeDecorator([
    {
        strategy: (_, callback, contentState) => {
            const selection = contentState.getSelectionAfter()
            console.log(selection.getStartOffset())
            callback(selection.getStartOffset(), selection.getStartOffset()+1)
        },
        component: caret
    }
])

export const createEmptyInputState = () => {
    return EditorState.createEmpty()
}