// src/components/admin/AdminTable.tsx
import React from "react";

export interface Column<T> {
  key: keyof T;                           // ❗ KHÔNG CHO STRING TÙY Ý
  title: string;
  render?: (row: T) => React.ReactNode;   // Custom render
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
}

export function AdminTable<T extends object>({
  columns,
  data,
  rowKey,
}: AdminTableProps<T>) {
  return (
    <table className="admin-table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={String(col.key)}>{col.title}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length} style={{ textAlign: "center" }}>
              Không có dữ liệu.
            </td>
          </tr>
        ) : (
          data.map((row) => (
            <tr key={rowKey(row)}>
              {columns.map((col) => {
                const cellValue = row[col.key]; // 🎯 type-safe, không cần any

                return (
                  <td key={String(col.key)}>
                    {col.render ? col.render(row) : String(cellValue)}
                  </td>
                );
              })}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
