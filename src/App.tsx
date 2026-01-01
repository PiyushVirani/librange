import { useState } from 'react';
import rangesData from './data/ranges.json'; // Renamed for clarity
import CallNumberForm from './components/CallNumberForm';
import { ParsedCallNumber } from './types/ParsedCallNumber';
import { RangeMatch } from './types/RangeMatch'; // Import the new type
import { parseCallNumber } from './lib/parseCallNumber';
import { findRange } from './lib/findRange';     // Import the search logic
import { RangeRecord } from './types/RangeRecord';

// Cast the JSON import to our TypeScript type so findRange accepts it
const ranges = rangesData as RangeRecord[];

function App() {
  const [currentSearch, setCurrentSearch] = useState('');
  const [parsedData, setParsedData] = useState<ParsedCallNumber | null>(null);
  const [matchResult, setMatchResult] = useState<RangeMatch | null>(null); // New State

  const handleSearch = (term: string) => {
    setCurrentSearch(term);
    
    // 1. Parse
    const parsed = parseCallNumber(term);
    setParsedData(parsed);

    // 2. Search (Only if parsing was successful)
    if (parsed) {
        const match = findRange(parsed, ranges);
        setMatchResult(match);
        console.log("Search Result:", match); // Debug log
    } else {
        setMatchResult(null);
    }
  };

  return (
    <div>
      <h1>LibRange Project</h1>
      <p>Enter a call number below to find its location.</p>

      <CallNumberForm onSubmit={handleSearch} />

      <hr />
      
      {/* --- DEBUG VIEW --- */}
      <h3>Current Search: {currentSearch}</h3>

      {/* 1. Parser Feedback */}
      {parsedData && (
        <div style={{ background: '#f0f0f0', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
          <h4>Parser Output:</h4>
          <p><strong>Class:</strong> {parsedData.classLetters} {parsedData.classNumber}</p>
        </div>        
      )}

      {/* 2. Error Feedback */}
      {currentSearch && !parsedData && (
        <p style={{ color: 'red'}}>
          Could NOT understand this Call Number. Please try format: "QA 76"
        </p>
      )}

      {/* 3. Success / Match Feedback */}
      {matchResult ? (
          <div style={{ border: '2px solid green', padding: '15px', borderRadius: '8px' }}>
              <h2 style={{ color: 'green', marginTop: 0 }}>Found it!</h2>
              <p><strong>Floor:</strong> {matchResult.floor}</p>
              <p><strong>Section:</strong> {matchResult.section}</p>
              <p><strong>Range ID:</strong> {matchResult.id}</p>
              <p><em>(Map Region: {matchResult.mapRegionId})</em></p>
          </div>
      ) : (
          parsedData && (
              <div style={{ color: 'orange', fontWeight: 'bold' }}>
                  No matching range found in the database.
              </div>
          )
      )}
    </div>
  );
}

export default App;