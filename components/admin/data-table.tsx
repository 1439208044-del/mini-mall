"use client";

interface Column<T> {
  header: string;
  accessor: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  actions?: (row: T) => React.ReactNode;
}

export function DataTable<T>({ columns, data, keyField, actions }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-(--color-border)">
            {columns.map((col) => (
              <th
                key={col.header}
                className={`text-left py-3 px-4 font-medium text-(--color-muted) ${col.className || ""}`}
              >
                {col.header}
              </th>
            ))}
            {actions && (
              <th className="text-right py-3 px-4 font-medium text-(--color-muted) w-32">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={String(row[keyField] ?? Math.random())}
              className="border-b border-(--color-border) hover:bg-gray-50 transition-colors"
            >
              {columns.map((col) => (
                <td key={col.header} className={`py-3 px-4 ${col.className || ""}`}>
                  {col.accessor(row)}
                </td>
              ))}
              {actions && (
                <td className="py-3 px-4 text-right">{actions(row)}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
