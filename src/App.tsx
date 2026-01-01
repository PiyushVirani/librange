import { useState } from 'react';
import './App.css';

import rangesData from './data/ranges.json';
import CallNumberForm from './components/CallNumberForm';
import ResultPanel from './components/ResultPanel';

import { ParsedCallNumber } from './types/ParsedCallNumber';
import { RangeMatch } from './types/RangeMatch';
import { RangeRecord } from './types/RangeRecord';

import { parseCallNumber } from './lib/parseCallNumber';
import { findRange } from './lib/findRange';

const ranges = rangesData as RangeRecord[];

function App() {
  const [currentSearch, setCurrentSearch] = useState('');
  const [parsedData, setParsedData] = useState<ParsedCallNumber | null>(null);
  const [matchResult, setMatchResult] = useState<RangeMatch | null>(null);

  const handleSearch = (term: string) => {
    const normalized = term.trim();

    setCurrentSearch(normalized);

    // Reset on empty (extra safety; form validation should prevent this)
    if (!normalized) {
      setParsedData(null);
      setMatchResult(null);
      return;
    }

    // 1) Parse
    const parsed = parseCallNumber(normalized);
    setParsedData(parsed);

    // 2) Search
    if (parsed) {
      const match = findRange(parsed, ranges);
      setMatchResult(match);
    } else {
      setMatchResult(null);
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
                Enter a Library of Congress call number to find where the item is located in Carleton University's MacOdrum Library
              </p>
            </div>
          </div>
        </header>

        <div className="stack">
          <div className="card">
            <CallNumberForm onSubmit={handleSearch} />
          </div>

          <ResultPanel search={currentSearch} parsed={parsedData} match={matchResult} />
        </div>
      </div>
    </div>
  );
}

export default App;
