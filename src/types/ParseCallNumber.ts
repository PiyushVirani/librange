import { ParsedCallNumber } from "./ParsedCallNumber";

export function parseCallNumber(input: string): ParsedCallNumber | null {
    //ADD COMMENTS
    const clean = input.trim().toUpperCase();
    const regex = /^([A-Z]+)\s*([0-9]+)/;
    const match = clean.match(regex);

    if (!match) return null;

    return {
        raw:input,
        classLetters: match[1],
        classNumber:parseFloat(match[2]),
    };
}   