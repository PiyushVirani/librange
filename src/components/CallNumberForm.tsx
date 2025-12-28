import { useState} from "react";

export default function CallNumberForm() {
    
    const [userInput, setUserInput] = useState('');

    const handleSubmit = (e:React.FormEvent) => {
        e.preventDefault();
        alert(`You Sent ${userInput}`);
        console.log(userInput);
    }
    return (
    <form onSubmit={handleSubmit}>
      <label>Enter Call Number:</label>
      <input 
        type="text" 
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      />
      
      <button type="submit">Send</button>
    </form>
  );
}