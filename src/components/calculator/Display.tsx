import Draft, { CompositeDecorator, DraftHandleValue, Editor, EditorState, Modifier, SelectionState } from "draft-js";
import "draft-js/dist/Draft.css";
import React from "react";
import { evaluate } from "../../utils/evaluationStrategies/mathjsEvaluate"

const outputFormatter = new Intl.NumberFormat(undefined, {
    useGrouping: false,
    maximumFractionDigits: 10
})

interface Props {
    inputState: EditorState,
    onChange: (state: EditorState) => void
}

export const CalculatorDisplay = React.forwardRef<Editor, Props>(({ inputState, onChange }, ref) => {
    const input = inputState.getCurrentContent().getPlainText();
    const output = evaluate(input);

    const handleKeyCommand = (command: string): DraftHandleValue => {
        if (command ==="no-op") return "handled";
        else if (command === "equal") {
            onChange(moveOutputToInput(inputState, String(output)))
            return "handled";
        } else if (command === "C") {
            onChange(createEmptyInputState());
            return "handled";
        } else if (command === "back") {
            onChange(deleteSelection(inputState));
            return "handled"
        }
        return "not-handled";
    }

    return (
        <div className="calculatord-isplay">
            <div className="input-display">
                <Editor
                    editorState={inputState}
                    onChange={onChange}
                    textAlignment="right"
                    ref={ref}
                    keyBindingFn={inputKeyBindings}
                    handleKeyCommand={handleKeyCommand}
                />
            </div>
            <div className="value-display">
                <output>{output}</output>
            </div>
        </div>
    );
});

const inputKeyBindings = (e: React.KeyboardEvent<{}>) => {
    const { key } = e;
    console.log(key);

    //null - fall through to default

    //allow navigation, digits and operators
    if (key.startsWith("Arrow")) return null;
    if (!isNaN(+key)) return null;

    const allowedInputs = ["+", "-", "*", "/", "^", "=", "(", ")", "."]
    if (allowedInputs.includes(key)) return null;

    if (key === "Enter") return "equal";
    if (key === "Delete") return "C";
    if (key === "Backspace") return "back";
    //block anything else
    return "no-op";
}

export const typeToInput = (inputState: EditorState, text: string): EditorState => {
    const contentState = inputState.getCurrentContent();
    const selection = inputState.getSelection();

    const contentStateAfterInsertion = Modifier.replaceText(
        contentState,
        selection,
        text
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
    return editorStateAfterSelectionFix;
}

export const moveOutputToInput = (inputState: EditorState, output: string): EditorState => {
    const contentState = inputState.getCurrentContent();
    const input = contentState.getPlainText();
    const entireInputSelection = inputState.getSelection().set("anchorOffset", 0).set("focusOffset", input.length) as SelectionState;
    const contentStateAfterReplace = Modifier.replaceText(
        contentState,
        entireInputSelection,
        String(output)
    );
    return EditorState.moveFocusToEnd(EditorState.push(
        inputState,
        contentStateAfterReplace,
        "change-block-data"
    ));
}

export const deleteSelection = (inputState: EditorState): EditorState => {
    const contentState = inputState.getCurrentContent();
    const selection = inputState.getSelection();
    //caret at the start, do nothing
    if (selection.getStartOffset() === 0 && selection.isCollapsed()) return inputState;

    const rangeToDelete = selection.isCollapsed() 
        ? selection.set("anchorOffset", selection.getAnchorOffset() - 1) as SelectionState
        : selection;
    const newContentState = Modifier.removeRange(
        contentState,
        rangeToDelete,
        "backward"
    );
    return EditorState.push(
        inputState,
        newContentState,
        "delete-character"
    );
}


//apply inline styling to parts of input

const inputStyles = {
    operator: {
        color: "blue"
    }
};

type inputDecoratorComponent = React.FC<{
    offsetKey: string,
    children: React.ReactNode
}>

const operator: inputDecoratorComponent = ({ offsetKey, children }) => <span
    data-offset-key={offsetKey}
    style={inputStyles.operator}
>{children}</span>

type strategyCallback = (start: number, end: number) => void;
const regexStrategy = (regex: RegExp, contentState: Draft.ContentBlock, callback: strategyCallback) => {
    const text = contentState.getText();
    for (const match of text.matchAll(regex)) {
        callback(match.index!, match.index! + match[0].length)
    }
}

const inputDecorator = new CompositeDecorator([
    {
        strategy: (contentBlock, callback) => {
            regexStrategy(/[\^/*+-]/g, contentBlock, callback)
        },
        component: operator
    }
])

export const createEmptyInputState = () => {
    return EditorState.createEmpty(inputDecorator)
}
