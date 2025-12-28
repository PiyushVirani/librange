import {useState} from 'react';
import CallNumberForm from './components/CallNumberForm';

function App() {
  const [currentSearch, setCurrentSearch] = useState('');

  const handleSearch = (term: string) => {
    setCurrentSearch(term);
    console.log("App received:", term);
  };
  return (
    <div>
      <h1>LibRange Project</h1>
      <p>Enter a call number below to find its location.</p>

    <CallNumberForm onSubmit={handleSearch} />

    <hr />

    <h3>Current Search: {currentSearch} </h3>

    </div>
  );
}

export default App;