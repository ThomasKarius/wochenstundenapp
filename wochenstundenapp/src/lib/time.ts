export function parseTimeToMinutes(t: string): number | null {
  if (!t || !/^\d{2}:\d{2}$/.test(t)) return null;
  const [hh, mm] = t.split(":").map(Number);
  if (hh < 0 || hh > 23 || mm < 0 || mm > 59) return null;
  return hh * 60 + mm;
}

export function minutesToHHMM(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function calcWorkMinutes(start: string, end: string, pauseMinutes: number): number {
  const s = parseTimeToMinutes(start);
  const e = parseTimeToMinutes(end);
  if (s === null || e === null) return 0;

  let duration = e - s;
  if (duration < 0) duration += 24 * 60;

  const net = duration - Math.max(0, pauseMinutes || 0);
  return Math.max(0, net);
}
