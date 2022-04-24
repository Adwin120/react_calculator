import { evaluate as mathjsEvaluate } from "mathjs"

export const evaluate = (input: string): number | null => {
    let result = null;
    
    try {
        result = mathjsEvaluate(input);
    } catch {}

    if (typeof result !== "number") return null;
    return result;
}