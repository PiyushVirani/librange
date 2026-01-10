import { useState } from "react";
import "./App.css";

import rangesData from "./data/ranges.json";
import sectionsData from "./data/sections.json";

import CallNumberForm from "./components/CallNumberForm";
import ResultPanel from "./components/ResultPanel";

import { ParsedCallNumber } from "./types/ParsedCallNumber";
import { RangeMatch } from "./types/RangeMatch";
import { RangeRecord } from "./types/RangeRecord";
import { SectionMatch } from "./types/SectionMatch";
import { SectionRecord } from "./types/SectionRecord";

import { parseCallNumber } from "./lib/parseCallNumber";
import { findRange } from "./lib/findRange";
import { findSection } from "./lib/findSection";

const ranges = rangesData as RangeRecord[];
const sections = sectionsData as SectionRecord[];

function App() {
  const [currentSearch, setCurrentSearch] = useState("");
  const [parsedData, setParsedData] = useState<ParsedCallNumber | null>(null);
  const [matchResult, setMatchResult] = useState<RangeMatch | null>(null);
  const [sectionResult, setSectionResult] = useState<SectionMatch | null>(null);

  const handleSearch = (term: string) => {
    const normalized = term.trim();

    setCurrentSearch(normalized);

    // Reset on empty (extra safety; form validation should prevent this)
    if (!normalized) {
      setParsedData(null);
      setMatchResult(null);
      setSectionResult(null);
      return;
    }

    // 1) Parse
    const parsed = parseCallNumber(normalized);
    setParsedData(parsed);

    // 2) Search
    if (parsed) {
      const match = findRange(parsed, ranges);
      setMatchResult(match);

      const s = findSection(parsed, sections);
      setSectionResult(s);
    } else {
      setMatchResult(null);
      setSectionResult(null);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <div className="brandRow">
            <div className="brandMark" aria-hidden="true" />
            <div>
              <h1 className="title">LibRange</h1>
              <p className="subtitle">
                Enter a call number to find where an item is located in the MacOdrum Library.
              </p>
            </div>
          </div>
        </header>

        <div className="stack">
          <div className="card">
            <CallNumberForm onSubmit={handleSearch} />
          </div>

          <ResultPanel
            search={currentSearch}
            parsed={parsedData}
            match={matchResult}
            section={sectionResult}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
