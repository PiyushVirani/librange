# LibRange

#### Description
A web application that reduces the time it takes to find books and items at the MacOdrum Library (by X%).

## Data format

### `ranges.json` (physical ranges)
`src/data/ranges.json` contains an array of *physical* shelf ranges. Each physical range has two independent call-number spans (left side and right side):

- `floorNumber`: integer floor (e.g., 1, 3, 5)
- `rangeNumber`: integer range index on that floor (e.g., 1, 2, 3...)
- `startLeft`, `endLeft`: call number span for the left side of the range
- `startRight`, `endRight`: call number span for the right side of the range

Keys are computed automatically at runtime from the human-readable call numbers, so you do NOT need to maintain `startKey` / `endKey` fields.

### `sections.json` (general sections)
`src/data/sections.json` contains an array of *general section* spans:

- `name`: section label shown in the UI
- `start`, `end`: call number span (human-readable)

This exists because a physical range can contain call numbers from more than one section. The app finds the physical range from `ranges.json`, and independently finds the section name from `sections.json`.
