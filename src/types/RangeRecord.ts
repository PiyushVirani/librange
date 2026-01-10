export interface RangeRecord {
  floorNumber: number; // int
  rangeNumber: number; // int

  // Left side of the physical range
  startLeft: string;
  endLeft: string;

  // Right side of the physical range
  startRight: string;
  endRight: string;
}
