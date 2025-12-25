import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { minutesToHHMM } from "./time";

export type RowData = {
  dayLabel: string;
  start: string;
  pause: number;
  end: string;
  workMinutes: number;
  tour: string;
  expenses: number;
};

export type PdfData = {
  name: string;
  weekFrom: string;
  weekTo: string;
  kw: string;
  date: string;
  rows: RowData[];
  totalMinutes: number;
  totalExpenses: number;
  signatureDataUrl?: string;
};

export function exportTimesheetPdf(data: PdfData) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  doc.setFontSize(16);
  doc.text("Wochenbericht", 40, 50);

  doc.setFontSize(10);
  doc.text(`Name: ${data.name || "-"}`, 40, 75);
  doc.text(`vom - bis: ${data.weekFrom || "-"} - ${data.weekTo || "-"}`, 40, 92);
  doc.text(`KW: ${data.kw || "-"}`, 420, 92);

  const body = data.rows.map((r) => [
    r.dayLabel,
    r.start || "-",
    r.pause ? `${r.pause}` : "0",
    r.end || "-",
    minutesToHHMM(r.workMinutes),
    r.tour || "",
    r.expenses ? r.expenses.toFixed(2) : "0.00",
  ]);

  autoTable(doc, {
    startY: 115,
    head: [["Tag", "Start", "Pause (min)", "Ende", "Stunden abzügl. Pause", "Tour", "Spesen (€)"]],
    body,
    styles: { fontSize: 9, cellPadding: 6 },
    headStyles: { fillColor: [11, 42, 74] },
    columnStyles: { 0: { cellWidth: 70 }, 4: { cellWidth: 90 }, 5: { cellWidth: 140 } },
  });

  const finalY = (doc as any).lastAutoTable?.finalY ?? 115;

  doc.setFontSize(10);
  doc.text(`Summe Stunden: ${minutesToHHMM(data.totalMinutes)}`, 40, finalY + 25);
  doc.text(`Summe Spesen: ${data.totalExpenses.toFixed(2)} €`, 260, finalY + 25);

  doc.text(`Datum: ${data.date || "-"}`, 40, finalY + 60);

  doc.text("Unterschrift:", 300, finalY + 60);
  if (data.signatureDataUrl) {
    doc.addImage(data.signatureDataUrl, "PNG", 300, finalY + 70, 220, 80);
  } else {
    doc.setDrawColor(160);
    doc.setLineWidth(1);
    doc.rect(300, finalY + 70, 220, 80);
  }

  doc.save(`Wochenbericht_KW${data.kw || "xx"}_${data.weekFrom || ""}.pdf`);
}
