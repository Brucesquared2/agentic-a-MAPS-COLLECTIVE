import React, { useEffect, useState } from "react";
import { getRecentInvocations, LedgerEntry } from "../lib/loadLedger";

export const NavigatorPanel: React.FC = () => {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);

  useEffect(() => {
    try {
      const data = getRecentInvocations(10);
      setEntries(data);
    } catch (err) {
      // Loader may fail in browser environments; keep UI resilient
      // and surface no entries instead of crashing.
      // eslint-disable-next-line no-console
      console.error("Failed to load recent invocations:", err);
      setEntries([]);
    }
  }, []);

  return (
    <div className="navigator-panel">
      <h2>🧾 Capsule Activity Ledger</h2>
      {entries.length === 0 ? (
        <p>No recent invocations recorded.</p>
      ) : (
        <ul>
          {entries.map((entry, idx) => (
            <li key={idx} className="ledger-entry">
              <strong>{entry.agent}</strong> — {entry.action}
              <br />
              <span className="timestamp">{entry.timestamp}</span>
              {entry.notes && <p className="notes">{entry.notes}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NavigatorPanel;
