import { useMemo, useState } from 'react';

interface CallNumberFormProps {
  onSubmit: (callNumber: string) => void;
}

export default function CallNumberForm({ onSubmit }: CallNumberFormProps) {
  const [userInput, setUserInput] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const trimmed = useMemo(() => userInput.trim(), [userInput]);
  const canSubmit = trimmed.length > 0;

  const validate = (value: string): string | null => {
    const v = value.trim();
    if (!v) return 'Please enter a call number.';

    // Allow common call number characters for MVP: letters, numbers, spaces, periods,
    // and a few separators that appear in real labels.
    const allowed = /^[A-Z0-9.\s\/:-]+$/i;
    if (!allowed.test(v)) {
      return 'Only letters, numbers, spaces, and . / : - are allowed.';
    }

    // Soft check (not strict): must start with letters
    if (!/^[A-Z]+/i.test(v)) {
      return 'Call numbers usually start with letters (e.g., "QA 76").';
    }

    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const err = validate(userInput);
    if (err) {
      setFormError(err);
      return;
    }

    setFormError(null);
    onSubmit(userInput.trim());
  };

  const handleClear = () => {
    setUserInput('');
    setFormError(null);
    // Optional: also clear results (by submitting empty) is avoided on purpose
  };

  return (
    <form className="formGrid" onSubmit={handleSubmit} noValidate>
      <div className="labelRow">
        <label className="label" htmlFor="callNumber">
          Enter Call Number
        </label>
        <span className="hint">Example: QA 76.73.J38</span>
      </div>

      <div className="inputRow">
        <input
          id="callNumber"
          className="input"
          type="text"
          value={userInput}
          onChange={(e) => {
            setUserInput(e.target.value);
            if (formError) setFormError(null);
          }}
          aria-invalid={formError ? 'true' : 'false'}
          aria-describedby={formError ? 'callnumber-error' : undefined}
          autoComplete="off"
          inputMode="text"
        />

        <div className="actions">
          <button className="button" type="submit" disabled={!canSubmit}>
            Find Range
          </button>
          <button className="buttonSecondary" type="button" onClick={handleClear} disabled={!userInput}>
            Clear
          </button>
        </div>
      </div>

      {formError && (
        <p className="formError" id="callnumber-error" role="alert">
          {formError}
        </p>
      )}
    </form>
  );
}
