import React, { useEffect, useMemo, useState } from "react";
import WeekHeader from "./components/WeekHeader";
import TimesheetTable, { DayRow } from "./components/TimesheetTable";
import SignaturePad from "./components/SignaturePad";
import { calcWorkMinutes } from "./lib/time";
import { exportTimesheetPdf } from "./lib/pdf";

type PersistedState = {
  name: string;
  weekFrom: string;
  weekTo: string;
  kw: string;
  date: string;
  rows: DayRow[];
  signatureDataUrl?: string;
};

const STORAGE_KEY = "wochenstundenapp:v1";

function defaultRows(): DayRow[] {
  const days = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
  return days.map((d, idx) => ({
    id: `d${idx}`,
    dayLabel: d,
    start: "",
    pause: 0,
    end: "",
    tour: "",
    expenses: 0,
  }));
}

export default function App() {
  const [name, setName] = useState("");
  const [weekFrom, setWeekFrom] = useState("");
  const [weekTo, setWeekTo] = useState("");
  const [kw, setKw] = useState("");
  const [date, setDate] = useState("");
  const [rows, setRows] = useState<DayRow[]>(defaultRows());
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed: PersistedState = JSON.parse(raw);
      setName(parsed.name || "");
      setWeekFrom(parsed.weekFrom || "");
      setWeekTo(parsed.weekTo || "");
      setKw(parsed.kw || "");
      setDate(parsed.date || "");
      setRows(parsed.rows?.length ? parsed.rows : defaultRows());
      setSignatureDataUrl(parsed.signatureDataUrl);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const state: PersistedState = { name, weekFrom, weekTo, kw, date, rows, signatureDataUrl };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [name, weekFrom, weekTo, kw, date, rows, signatureDataUrl]);

  const computed = useMemo(() => {
    const rowsWithWork = rows.map((r) => ({
      ...r,
      workMinutes: calcWorkMinutes(r.start, r.end, r.pause || 0),
    }));
    const totalMinutes = rowsWithWork.reduce((a, r) => a + r.workMinutes, 0);
    const totalExpenses = rowsWithWork.reduce((a, r) => a + (Number.isFinite(r.expenses) ? r.expenses : 0), 0);
    return { rowsWithWork, totalMinutes, totalExpenses };
  }, [rows]);

  function resetAll() {
    setName("");
    setWeekFrom("");
    setWeekTo("");
    setKw("");
    setDate("");
    setRows(defaultRows());
    setSignatureDataUrl(undefined);
    localStorage.removeItem(STORAGE_KEY);
  }

  function downloadPdf() {
    exportTimesheetPdf({
      name,
      weekFrom,
      weekTo,
      kw,
      date,
      rows: computed.rowsWithWork.map((r) => ({
        dayLabel: r.dayLabel,
        start: r.start,
        pause: r.pause || 0,
        end: r.end,
        workMinutes: r.workMinutes,
        tour: r.tour,
        expenses: Number.isFinite(r.expenses) ? r.expenses : 0,
      })),
      totalMinutes: computed.totalMinutes,
      totalExpenses: computed.totalExpenses,
      signatureDataUrl,
    });
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Wochenbericht</h1>

        <WeekHeader
          name={name}
          setName={setName}
          weekFrom={weekFrom}
          setWeekFrom={setWeekFrom}
          weekTo={weekTo}
          setWeekTo={setWeekTo}
          kw={kw}
          setKw={setKw}
          date={date}
          setDate={setDate}
        />

        <TimesheetTable rows={rows} setRows={setRows} />

        <SignaturePad onChange={(url) => setSignatureDataUrl(url)} />

        <div className="actions">
          <button type="button" onClick={downloadPdf}>
            PDF herunterladen
          </button>
          <button type="button" className="secondary" onClick={resetAll}>
            Zurücksetzen
          </button>
        </div>

        <div className="small" style={{ marginTop: 10 }}>
          Hinweis: Diese Version speichert lokal im Browser. Für Mehrbenutzer/Cloud-Sync bräuchtest du zusätzlich ein Backend.
        </div>
      </div>
    </div>
  );
}
