import { RangeRecord } from "./RangeRecord";

export interface RangeMatch extends RangeRecord {
  side: "left" | "right";
}
