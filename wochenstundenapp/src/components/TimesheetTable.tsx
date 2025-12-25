import React from "react";
import { calcWorkMinutes, minutesToHHMM } from "../lib/time";

export type DayRow = {
  id: string;
  dayLabel: string;
  start: string;
  pause: number;
  end: string;
  tour: string;
  expenses: number;
};

type Props = {
  rows: DayRow[];
  setRows: (rows: DayRow[]) => void;
};

export default function TimesheetTable({ rows, setRows }: Props) {
  function updateRow(id: string, patch: Partial<DayRow>) {
    setRows(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  const computed = rows.map((r) => {
    const workMinutes = calcWorkMinutes(r.start, r.end, r.pause || 0);
    return { ...r, workMinutes };
  });

  const totalMinutes = computed.reduce((a, r) => a + r.workMinutes, 0);
  const totalExpenses = computed.reduce((a, r) => a + (Number.isFinite(r.expenses) ? r.expenses : 0), 0);

  return (
    <table>
      <thead>
        <tr>
          <th>Tag</th>
          <th>Start</th>
          <th>Pause</th>
          <th>Ende</th>
          <th>Stunden abzügl. Pause</th>
          <th>Tour (unterteilen in Tour 1, Tour 2 usw.)</th>
          <th>Spesen</th>
        </tr>
      </thead>

      <tbody>
        {computed.map((r) => (
          <tr key={r.id}>
            <td className="day">{r.dayLabel}</td>

            <td>
              <input type="time" value={r.start} onChange={(e) => updateRow(r.id, { start: e.target.value })} />
            </td>

            <td>
              <input
                type="number"
                min={0}
                value={r.pause ?? 0}
                onChange={(e) => updateRow(r.id, { pause: Number(e.target.value) })}
                placeholder="min"
              />
              <div className="small">Minuten</div>
            </td>

            <td>
              <input type="time" value={r.end} onChange={(e) => updateRow(r.id, { end: e.target.value })} />
            </td>

            <td>
              <input value={minutesToHHMM(r.workMinutes)} readOnly />
              <div className="small">HH:MM</div>
            </td>

            <td>
              <input value={r.tour} onChange={(e) => updateRow(r.id, { tour: e.target.value })} placeholder="Tour eingeben..." />
            </td>

            <td>
              <input
                type="number"
                min={0}
                step="0.01"
                value={Number.isFinite(r.expenses) ? r.expenses : 0}
                onChange={(e) => updateRow(r.id, { expenses: Number(e.target.value) })}
              />
              <div className="small">€</div>
            </td>
          </tr>
        ))}
      </tbody>

      <tfoot>
        <tr>
          <td colSpan={4}>Summe:</td>
          <td>{minutesToHHMM(totalMinutes)}</td>
          <td></td>
          <td>{totalExpenses.toFixed(2)} €</td>
        </tr>
      </tfoot>
    </table>
  );
}
