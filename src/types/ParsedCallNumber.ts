export interface ParsedCallNumber {
  raw: string;
  classLetters: string;
  classNumber: number;

  // Preserve decimal digits for stable sorting (e.g., 76.9 vs 76.73)
  classDecimalDigits?: string;

  // First cutter normalized like ".H37"
  itemCutter?: string;

  // Optional 4-digit year
  year?: number;
}
