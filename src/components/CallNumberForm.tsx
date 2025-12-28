import { useState} from "react";

interface CallNumberFormProps {
    onSubmit: (callNumber: string) => void;
}

export default function CallNumberForm({onSubmit }: CallNumberFormProps) {
    
    const [userInput, setUserInput] = useState('');

    const handleSubmit = (e:React.FormEvent) => {
        e.preventDefault();
        
        onSubmit(userInput);
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