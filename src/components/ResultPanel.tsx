import { ParsedCallNumber } from "../types/ParsedCallNumber";
import { RangeMatch } from "../types/RangeMatch";

interface ResultPanelProps {
  search: string;
  parsed: ParsedCallNumber | null;
  match: RangeMatch | null;
}

function formatParsed(parsed: ParsedCallNumber): string {
  const number = Number.isFinite(parsed.classNumber) ? String(parsed.classNumber) : "";
  const cutter = parsed.itemCutter ? ` ${parsed.itemCutter}` : "";
  const year = parsed.year ? ` ${parsed.year}` : "";
  return `${parsed.classLetters} ${number}${cutter}${year}`.trim();
}

export default function ResultPanel({ search, parsed, match }: ResultPanelProps) {
  // 1) Idle
  if (!search) {
    return (
      <section className="card resultCard--idle" aria-live="polite">
        <div className="resultHeader">
          <h2 className="resultTitle">Result</h2>
          <span className="badge badge--idle">
            <span className="badgeDot" aria-hidden="true" />
            Ready
          </span>
        </div>
        <div className="resultBody">
          <p className="note">Enter a call number above to look up the matching range.</p>
          <p className="note">Tip: You can paste directly from the catalog label.</p>
        </div>
      </section>
    );
  }

  // 2) Parse failed
  if (!parsed) {
    return (
      <section className="card resultCard--error" aria-live="polite">
        <div className="resultHeader">
          <h2 className="resultTitle">Result</h2>
          <span className="badge badge--error">
            <span className="badgeDot" aria-hidden="true" />
            Couldn't parse
          </span>
        </div>

        <div className="resultBody">
          <p className="note">We couldn't understand that call number.</p>

          <div className="kvGrid">
            <div className="kv">
              <div className="k">You entered</div>
              <div className="v">{search}</div>
            </div>
            <div className="kv">
              <div className="k">Try a format like</div>
              <div className="v">QA 76</div>
            </div>
          </div>

          <p className="note">
            For this prototype, start with letters + a number (decimals/cutters may appear after).
          </p>
        </div>
      </section>
    );
  }

  // 3) Parsed OK, but no match
  if (!match) {
    return (
      <section className="card resultCard--error" aria-live="polite">
        <div className="resultHeader">
          <h2 className="resultTitle">Result</h2>
          <span className="badge badge--error">
            <span className="badgeDot" aria-hidden="true" />
            Invalid Range
          </span>
        </div>

        <div className="resultBody">
          <p className="note">No item with this call number was found in the current ranges dataset.</p>

          <div className="kvGrid">
            <div className="kv">
              <div className="k">Parsed as</div>
              <div className="v">{formatParsed(parsed)}</div>
            </div>
            <div className="kv">
              <div className="k">Status</div>
              <div className="v">Invalid Range</div>
            </div>
          </div>

          <p className="note">Add or update a range entry that covers this call number, then try again.</p>
        </div>
      </section>
    );
  }

  // 4) Success
  return (
    <section className="card resultCard--success" aria-live="polite">
      <div className="resultHeader">
        <h2 className="resultTitle">Result</h2>
        <span className="badge badge--success">
          <span className="badgeDot" aria-hidden="true" />
          Found
        </span>
      </div>

      <div className="resultBody">
        <p className="note">Head to the location below. (Map highlighting comes next in Phase 3.)</p>

        <div className="kvGrid">
          <div className="kv">
            <div className="k">Floor</div>
            <div className="v">Floor {match.floorNumber}</div>
          </div>
          <div className="kv">
            <div className="k">Section</div>
            <div className="v">{match.section}</div>
          </div>
          <div className="kv">
            <div className="k">Range #</div>
            <div className="v">{match.rangeNumber}</div>
          </div>
          <div className="kv">
            <div className="k">Range (data)</div>
            <div className="v">
              {match.start} to {match.end}
            </div>
          </div>
        </div>

        <p className="note">
          Parsed call number: <strong>{formatParsed(parsed)}</strong>
        </p>
      </div>
    </section>
  );
}
