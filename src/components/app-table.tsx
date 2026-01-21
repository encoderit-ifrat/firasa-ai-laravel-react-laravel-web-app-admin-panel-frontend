// @disable-react-compiler
"use client";
import { nanoid } from "nanoid";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
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
}

export default function AppTable<T>({ data, columns }: AppTableProps<T>) {
  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
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
                key={nanoid()}
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
        {rows.map((row) => (
          <TableRow key={row.id} className="hover:bg-gray-50 ">
            {row.getVisibleCells().map((cell) => (
              <TableCell
                key={nanoid()}
                className="whitespace-nowrap truncate px-2 py-1"
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
