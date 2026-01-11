import { RangeRecord } from "./RangeRecord";

export interface RangeMatch extends RangeRecord {
  side: "left" | "right";

  // The matched span (normalized ordering if data was reversed).
  spanStart: string;
  spanEnd: string;
}
