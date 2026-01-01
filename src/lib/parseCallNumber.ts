import { ParsedCallNumber } from "../types/ParsedCallNumber";

export function parseCallNumber(input: string): ParsedCallNumber | null {
    const clean = input.trim().toUpperCase();
    
    // Regex breakdown:
    // ^([A-Z]+)       -> Capture Start Letters (Group 1)
    // \s* -> Optional space
    // ([0-9.]+)       -> Capture Class Number (Group 2)
    // \s* -> Optional space
    // (\.[A-Z][0-9]+)? -> Optional Capture Cutter (Group 3) e.g., ".C65"
    const regex = /^([A-Z]+)\s*([0-9.]+)\s*(\.[A-Z][0-9]+)?/;
    const match = clean.match(regex);

    if (!match) return null;

    return {
        raw: input,
        classLetters: match[1],
        classNumber: parseFloat(match[2]),
        itemCutter: match[3] || undefined 
    };
}