export interface ParsedCallNumber {
    // The unsorted user input
    raw: string;
    // First Letters (e.g., "QA")
    classLetters: string;
    // The Number (e.g., 76.73)
    classNumber: number;
    // The first Cutter, if present (e.g., ".C15")
    itemCutter?: string;
}