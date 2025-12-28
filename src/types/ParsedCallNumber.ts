export interface ParsedCallNumber {
    // The unsorted user input
    raw: string 
    // First Letters in a Call Number
    classLetters: string
    // The Number that follows the first letter(s)
    classNumber: number;
    //The Cutters (Parts of the Call Number that follow the First Letter(s) and Number and are optional)
    cutter1: string;
    cutter2: string;
    // Year, Version, and Copy 
    year?: number;
    other?: string;
}