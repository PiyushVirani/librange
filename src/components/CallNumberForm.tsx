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
    const raw = value;
    const normalized = raw.replace(/\s+/g, ' ').trim();
    if (!normalized) return 'Please enter a call number.';

    // Allowed characters for this prototype (matches what we can validate safely).
    // Note: \s includes newlines/tabs, which are common when pasting multi-line labels.
    const allowed = /^[A-Z0-9.\s\/:-]+$/i;
    if (!allowed.test(raw)) {
      return 'Only letters, numbers, spaces, and . / : - are allowed.';
    }

    const v = normalized.toUpperCase();

    // Rule: first line is a Letter Line; and may not start with 4+ consecutive letters.
    const letterMatch = v.match(/^([A-Z]+)/);
    if (!letterMatch) {
      return 'Call numbers must start with letters (e.g., "QA 76").';
    }
    const letters = letterMatch[1];
    if (letters.length >= 4) {
      return 'A call number may not start with 4 or more consecutive letters.';
    }

    // Remainder after the letter line
    let rest = v.slice(letters.length).trimStart();
    if (!rest) {
      return 'After the letters, a call number needs a whole number line (e.g., "QA 76").';
    }

    // Rule: x ("little x") may appear after letters but before numbers (represents 1/2).
    // We only treat it as the half-marker when it is immediately followed by the number.
    if (/^X(?=\s*\d)/.test(rest)) {
      rest = rest.slice(1).trimStart();
    }

    // Rule: second line is a Whole Number line; max 4 digits before the first decimal point.
    // Accept optional decimalization (spaces around '.' allowed) ONLY when '.' is followed by digits.
    const numMatch = rest.match(/^(\d{1,4})(?:\s*\.\s*(\d+))?/);
    if (!numMatch) {
      return 'The second line must start with a whole number (up to 4 digits), e.g., "QA 76" or "QA 76.73".';
    }

    const consumed = numMatch[0].length;
    const afterNumRaw = rest.slice(consumed);

    // If the next character is another digit, then the whole number had 5+ digits (definite violation).
    if (/^\d/.test(afterNumRaw)) {
      return 'The whole number line can have at most 4 digits before the decimal point.';
    }

    let afterNum = afterNumRaw.trimStart();

    // Definite violation: another decimal point continuing the class number (e.g., 76.7.3 or 76..73)
    // After class-number parsing, a '.' followed by a digit cannot be valid.
    if (/^\.\s*\d/.test(afterNum) || afterNum.startsWith('..')) {
      return 'The class number can contain at most one decimal point.';
    }

    // Rule: Cutter line begins with a decimal, then a letter, then digits.
    // Only enforce this if the next non-space char is '.' (because that unambiguously signals a cutter/decimal).
    if (afterNum.startsWith('.')) {
      const cutterMatch = afterNum.match(/^\.\s*[A-Z]\s*(?:\d\s*)+/);
      if (!cutterMatch) {
        return 'A cutter line must start with "." then a letter then digits (e.g., ".J38").';
      }

      // Optional rule: volume/copy/date ordering (only when explicitly labeled).
      // We enforce only obvious markers: v.# / vol.#, c.#, and a 4-digit year.
      afterNum = afterNum.slice(cutterMatch[0].length).trimStart();
    }

    // Volumes are compared before copies; copies before dates.
    // We only enforce ordering when tokens are unambiguous.
    const tailTokens = afterNum ? afterNum.split(' ').filter(Boolean) : [];
    let stage = 0; // 0=none, 1=volume, 2=copy, 3=date

    for (const t of tailTokens) {
      const token = t.toUpperCase();

      const isVolume = /^V\.\d+$/.test(token) || /^VOL\.\d+$/.test(token);
      const isCopy = /^C\.\d+$/.test(token) || /^COPY\d+$/.test(token);
      const isYear = /^\d{4}$/.test(token) && Number(token) >= 1000 && Number(token) <= 2999;

      if (isYear) {
        stage = Math.max(stage, 3);
        continue;
      }

      if (isCopy) {
        if (stage >= 3) {
          return 'Copy numbers (e.g., "c.1") must come before dates (e.g., "2020").';
        }
        stage = Math.max(stage, 2);
        continue;
      }

      if (isVolume) {
        if (stage >= 2) {
          return 'Volume numbers (e.g., "v.2") must come before copy numbers and dates.';
        }
        stage = Math.max(stage, 1);
        continue;
      }
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
    onSubmit(userInput.replace(/\s+/g, ' ').trim());

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
