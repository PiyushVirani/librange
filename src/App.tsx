import {useState} from 'react';
import CallNumberForm from './components/CallNumberForm';
import { ParsedCallNumber } from './types/ParsedCallNumber';
import { parseCallNumber } from './lib/parseCallNumber';

function App() {
  const [currentSearch, setCurrentSearch] = useState('');
  const [parsedData, setParsedData] = useState<ParsedCallNumber | null>(null);

  const handleSearch = (term: string) => {
    setCurrentSearch(term);
    const result = parseCallNumber(term);
    setParsedData(result);
    console.log("App received:", term, result);
  };
  return (
    <div>
      <h1>LibRange Project</h1>
      <p>Enter a call number below to find its location.</p>

    <CallNumberForm onSubmit={handleSearch} />

    <hr />
    {/*Understand HTML/JSX here*/}
    <h3>Current Search: {currentSearch} </h3>
    {parsedData && (
      <div style={{ background: 'f0f0f0f0', padding: '10px', borderRadius: '5px' }}>
        <h4>Parser Output:</h4>
        <p><strong>Letters:</strong> {parsedData.classLetters}</p>
        <p><strong>Number:</strong> {parsedData.classNumber}</p>
    </div>        
    )}
    {currentSearch && !parsedData && (
      <p style={{ color: red}}>
        Could NOT understand this Call Number. Please try this format:xxxx
      </p>
    )}
    </div>

  );
}

export default App;