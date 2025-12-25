import React from "react";

type Props = {
  name: string;
  setName: (v: string) => void;
  weekFrom: string;
  setWeekFrom: (v: string) => void;
  weekTo: string;
  setWeekTo: (v: string) => void;
  kw: string;
  setKw: (v: string) => void;
  date: string;
  setDate: (v: string) => void;
};

export default function WeekHeader(props: Props) {
  return (
    <div className="row">
      <div className="field" style={{ minWidth: 280 }}>
        <label>Name</label>
        <input value={props.name} onChange={(e) => props.setName(e.target.value)} placeholder="Ihren Namen eingeben" />
      </div>

      <div className="field">
        <label>vom</label>
        <input type="date" value={props.weekFrom} onChange={(e) => props.setWeekFrom(e.target.value)} />
      </div>

      <div className="field">
        <label>bis</label>
        <input type="date" value={props.weekTo} onChange={(e) => props.setWeekTo(e.target.value)} />
      </div>

      <div className="field" style={{ width: 90 }}>
        <label>KW</label>
        <input value={props.kw} onChange={(e) => props.setKw(e.target.value)} placeholder="z.B. 52" />
      </div>

      <div className="field">
        <label>Datum</label>
        <input type="date" value={props.date} onChange={(e) => props.setDate(e.target.value)} />
      </div>

      <div className="field" style={{ flex: 1 }}>
        <div className="small">Tipp: Daten werden automatisch im Browser gespeichert (LocalStorage).</div>
      </div>
    </div>
  );
}
