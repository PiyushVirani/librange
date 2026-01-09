# LibRange

#### Description
A web application that reduces the time it takes to find books and items at the MacOdrum Library (by X%).

## Data format (ranges.json)

`src/data/ranges.json` contains an array of ranges:

- `start`: start call number (human-readable)
- `end`: end call number (human-readable)
- `floorNumber`: integer floor (e.g., 3, 5)
- `rangeNumber`: integer range index on that floor (e.g., 1, 2, 3...)
- `section`: label shown in the UI

Keys are computed automatically at runtime from `start` and `end`, so you do NOT need to maintain `startKey` / `endKey` fields.
