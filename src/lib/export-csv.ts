export interface CsvColumn<T> {
  header: string;
  value: (row: T) => string | number;
}

function escapeCsvCell(value: string | number) {
  const str = String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

export function exportToCsv<T>(filename: string, rows: T[], columns: CsvColumn<T>[]) {
  if (typeof document === "undefined" || rows.length === 0) return;

  const lines = [
    columns.map((c) => escapeCsvCell(c.header)).join(","),
    ...rows.map((row) => columns.map((c) => escapeCsvCell(c.value(row))).join(",")),
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
