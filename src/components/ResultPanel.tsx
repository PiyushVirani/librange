import { ParsedCallNumber } from "../types/ParsedCallNumber";
import { RangeMatch } from "../types/RangeMatch";
import { SectionMatch } from "../types/SectionMatch";

interface ResultPanelProps {
  search: string;
  parsed: ParsedCallNumber | null;
  match: RangeMatch | null;
  section: SectionMatch | null;
}

function formatParsed(parsed: ParsedCallNumber): string {
  const number = Number.isFinite(parsed.classNumber) ? String(parsed.classNumber) : "";
  const cutter = parsed.itemCutter ? ` ${parsed.itemCutter}` : "";
  const year = parsed.year ? ` ${parsed.year}` : "";
  return `${parsed.classLetters} ${number}${cutter}${year}`.trim();
}

function formatSide(side: "left" | "right"): string {
  return side === "left" ? "Left side" : "Right side";
}

export default function ResultPanel({ search, parsed, match, section }: ResultPanelProps) {
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

  // 3) Parsed OK, but no physical range match
  if (!match) {
    return (
      <section className="card resultCard--error" aria-live="polite">
        <div className="resultHeader">
          <h2 className="resultTitle">Result</h2>
          <span className="badge badge--error">
            <span className="badgeDot" aria-hidden="true" />
            No match
          </span>
        </div>

        <div className="resultBody">
          <p className="note">No physical range matched this call number in the current ranges dataset.</p>

          <div className="kvGrid">
            <div className="kv">
              <div className="k">Parsed as</div>
              <div className="v">{formatParsed(parsed)}</div>
            </div>
            <div className="kv">
              <div className="k">Section (if known)</div>
              <div className="v">{section?.name ?? "Unknown section"}</div>
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
            <div className="v">{section?.name ?? "Unknown section"}</div>
          </div>
          <div className="kv">
            <div className="k">Range #</div>
            <div className="v">{match.rangeNumber}</div>
          </div>
          <div className="kv">
            <div className="k">Side</div>
            <div className="v">{formatSide(match.side)}</div>
          </div>
        </div>

        <p className="note">
          Parsed call number: <strong>{formatParsed(parsed)}</strong>
        </p>
      </div>
    </section>
  );
}
