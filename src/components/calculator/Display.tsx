import { CompositeDecorator, Editor, EditorState } from "draft-js";
import "draft-js/dist/Draft.css";
import React from "react";
import { evaluate } from "../../utils/evaluationStrategies/mathjsEvaluate"

interface Props {
    inputState: EditorState,
    onChange: (state: EditorState) => void
}

export const CalculatorDisplay = React.forwardRef<Editor, Props>(({ inputState, onChange }, ref) => {
    const input = inputState.getCurrentContent().getPlainText();
    const output = evaluate(input);

    return (
        <div className="calculatord-isplay">
            <div className="input-display">
                <Editor
                    editorState={inputState}
                    onChange={onChange}
                    textAlignment="right"
                    ref={ref}
                    keyBindingFn={inputKeyBindings}
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
    console.log(key)

    //null - fall through to default

    //allow arrows and digits
    if (key.startsWith("Arrow")) return null;
    if (!isNaN(+key)) return null;

    const allowedInputs = ["Backspace", "+", "-", "*", "/", "^", "=", "(", ")", "."]
    if (allowedInputs.includes(key)) return null;

    return "handled"
}

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