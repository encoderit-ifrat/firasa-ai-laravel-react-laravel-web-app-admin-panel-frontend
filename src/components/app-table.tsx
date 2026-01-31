// @disable-react-compiler
"use client";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  getSortedRowModel,
  type VisibilityState,
  type OnChangeFn,
  type RowSelectionState,
} from "@tanstack/react-table";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "./ui/table";

interface AppTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  columnVisibility?: VisibilityState;
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
}

export default function AppTable<T>({
  data,
  columns,
  columnVisibility: propColumnVisibility,
  onColumnVisibilityChange: propOnColumnVisibilityChange,
  rowSelection: propRowSelection,
  onRowSelectionChange: propOnRowSelectionChange,
}: AppTableProps<T>) {
  const [internalColumnVisibility, setInternalColumnVisibility] = useState<VisibilityState>({});
  const [internalRowSelection, setInternalRowSelection] = useState<RowSelectionState>({});

  const columnVisibility = propColumnVisibility ?? internalColumnVisibility;
  const onColumnVisibilityChange = propOnColumnVisibilityChange ?? setInternalColumnVisibility;
  const rowSelection = propRowSelection ?? internalRowSelection;
  const onRowSelectionChange = propOnRowSelectionChange ?? setInternalRowSelection;

  const table = useReactTable({
    data: data ?? [],
    columns,
    state: {
      columnVisibility,
      rowSelection,
    },
    onColumnVisibilityChange,
    onRowSelectionChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const rows = table.getRowModel().rows;

  return (
    <Table className="w-full border-1 rounded-xl">
      {/* Table Header */}
      <TableHeader className="bg-[#F4F2F3]">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                className="text-start text-muted-foreground px-2 py-1"
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>

      {/* Table Body */}
      <TableBody className="bg-white">
        {rows && rows.length > 0 ? (
          rows.map((row) => (
            <TableRow key={row.id} className="hover:bg-gray-50 ">
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className="whitespace-nowrap truncate px-2 py-1"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="h-24 text-center text-muted-foreground"
            >
              No results found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
