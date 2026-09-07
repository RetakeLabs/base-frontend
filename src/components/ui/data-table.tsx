"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Download,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { exportToCsv } from "@/lib/export-csv";

export interface DataTableColumn<T> {
  header: string;
  accessor: (row: T) => ReactNode;
  /** Raw comparable value for this column. Presence of this prop is what makes a column sortable. */
  sortValue?: (row: T) => string | number;
  /** Plain-text value for CSV export. Falls back to `sortValue`, then to the
   * rendered `accessor` result if it's already a plain string/number. */
  csvValue?: (row: T) => string | number;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  keyExtractor: (row: T) => string;
  pageSize?: number;
  className?: string;
  /** When provided (with or without onDelete), an "Ações" column is appended automatically. */
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  /** Filename for the "Exportar CSV" button. Omit to hide the button. */
  csvFilename?: string;
}

type SortDirection = "asc" | "desc";

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  pageSize = 5,
  className,
  onEdit,
  onDelete,
  csvFilename,
}: DataTableProps<T>) {
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState<{ header: string; direction: SortDirection } | null>(null);

  const allColumns = useMemo<DataTableColumn<T>[]>(() => {
    if (!onEdit && !onDelete) return columns;
    return [
      ...columns,
      {
        header: "Ações",
        className: "w-12 text-right",
        accessor: (row: T) => (
          <div className="flex justify-end">
            <DropdownMenu
              align="right"
              trigger={
                <button
                  type="button"
                  aria-label="Abrir ações"
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <MoreVertical className="size-4" />
                </button>
              }
            >
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(row)}>
                  <Pencil className="size-4" />
                  Editar
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem destructive onClick={() => onDelete(row)}>
                  <Trash2 className="size-4" />
                  Excluir
                </DropdownMenuItem>
              )}
            </DropdownMenu>
          </div>
        ),
      },
    ];
  }, [columns, onEdit, onDelete]);

  const sortedData = useMemo(() => {
    if (!sort) return data;
    const column = allColumns.find((c) => c.header === sort.header);
    if (!column?.sortValue) return data;

    const direction = sort.direction === "asc" ? 1 : -1;
    return [...data].sort((a, b) => {
      const va = column.sortValue!(a);
      const vb = column.sortValue!(b);
      if (va < vb) return -1 * direction;
      if (va > vb) return 1 * direction;
      return 0;
    });
  }, [data, sort, allColumns]);

  const pageCount = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginated = useMemo(
    () => sortedData.slice(page * pageSize, page * pageSize + pageSize),
    [sortedData, page, pageSize]
  );

  function toggleSort(column: DataTableColumn<T>) {
    if (!column.sortValue) return;
    setPage(0);
    setSort((current) => {
      if (current?.header !== column.header) return { header: column.header, direction: "asc" };
      return { header: column.header, direction: current.direction === "asc" ? "desc" : "asc" };
    });
  }

  function handleExportCsv() {
    if (!csvFilename) return;
    exportToCsv(
      csvFilename,
      sortedData,
      columns.map((column) => ({
        header: column.header,
        value: (row: T) => {
          if (column.csvValue) return column.csvValue(row);
          if (column.sortValue) return column.sortValue(row);
          const rendered = column.accessor(row);
          return typeof rendered === "string" || typeof rendered === "number" ? rendered : "";
        },
      }))
    );
  }

  return (
    <div className={cn("rounded-lg border border-border bg-card", className)}>
      {csvFilename && (
        <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
          <span className="text-sm text-muted-foreground">
            {sortedData.length} registro{sortedData.length === 1 ? "" : "s"}
          </span>
          <Button variant="outline" size="sm" onClick={handleExportCsv}>
            <Download className="size-4" />
            Exportar CSV
          </Button>
        </div>
      )}
      <div className="max-h-[26rem] overflow-x-auto overflow-y-auto">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead className="sticky top-0 z-10 bg-card">
            <tr className="border-b border-border text-muted-foreground">
              {allColumns.map((column) => {
                const isSortable = !!column.sortValue;
                const isActive = sort?.header === column.header;
                return (
                  <th
                    key={column.header}
                    className={cn("px-4 py-3 font-medium", column.className)}
                  >
                    {isSortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(column)}
                        className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
                      >
                        {column.header}
                        {isActive ? (
                          sort!.direction === "asc" ? (
                            <ArrowUp className="size-3.5" />
                          ) : (
                            <ArrowDown className="size-3.5" />
                          )
                        ) : (
                          <ArrowUpDown className="size-3.5 opacity-40" />
                        )}
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {paginated.map((row) => (
              <tr
                key={keyExtractor(row)}
                className="border-b border-border transition-colors last:border-0 hover:bg-muted"
              >
                {allColumns.map((column) => (
                  <td
                    key={column.header}
                    className={cn("px-4 py-3 text-foreground", column.className)}
                  >
                    {column.accessor(row)}
                  </td>
                ))}
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td
                  colSpan={allColumns.length}
                  className="px-4 py-6 text-center text-muted-foreground"
                >
                  Nenhum registro encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-border px-4 py-3 text-sm text-muted-foreground">
        <span>
          Página {page + 1} de {pageCount}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            aria-label="Página anterior"
            className="rounded-md p-1.5 transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={page >= pageCount - 1}
            aria-label="Próxima página"
            className="rounded-md p-1.5 transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
