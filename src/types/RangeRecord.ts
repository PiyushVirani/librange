export interface RangeRecord {
    // Human-readable start of the range (e.g., "QA 1")
    start: string;
    // Human-readable end of the range (e.g., "QA 76")
    end: string;
    // The normalized sort key for the start (e.g., "QA-0001")
    startKey: string;
    // The normalized sort key for the end (e.g., "QA-0076")
    endKey: string;
    // Location details
    floor: string;
    section: string;
    // The ID that matches the <path> or <g> in your SVG Map
    mapRegionId: string;
}