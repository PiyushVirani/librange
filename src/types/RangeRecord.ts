export interface RangeRecord {
  // Human-readable start of the range (e.g., "QA 1")
  start: string;

  // Human-readable end of the range (e.g., "QA 76")
  end: string;

  // Location details
  floorNumber: number; // int
  rangeNumber: number; // int
  section: string;
}
