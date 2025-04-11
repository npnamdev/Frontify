'use client';
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

type Column<T> = {
  header: string;
  accessor: keyof T;
};

type ReusableTableProps<T extends { id: number | string }> = {
  columns: Column<T>[];
  data: T[];
  pageSize: number;
  currentPage: number;
  total: number;
  onSelect?: (selected: T[]) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  selectedIds: (string | number)[];
  setSelectedIds: (ids: (string | number)[]) => void;
  searchInput: string;
  setSearchInput: (value: string) => void;
};

export default function ReusableTable<T extends { id: number | string }>({
  columns,
  data,
  pageSize,
  currentPage,
  total,
  onSelect,
  onPageChange,
  onPageSizeChange,
  selectedIds,
  setSelectedIds,
  searchInput,
  setSearchInput,
}: ReusableTableProps<T>) {
  const [visibleColumns, setVisibleColumns] = React.useState(columns);

  const isAllSelected =
    data.length > 0 && data.every((d) => selectedIds.includes(d.id));

  const toggleSelectAll = () => {
    const pageIds = data.map((item) => item.id);
    const newSelected = isAllSelected
      ? selectedIds.filter((id) => !pageIds.includes(id))
      : Array.from(new Set([...selectedIds, ...pageIds]));

    setSelectedIds(newSelected);
    onSelect?.(data.filter((item) => newSelected.includes(item.id)));
  };

  const toggleSelectOne = (id: string | number) => {
    const newSelected = selectedIds.includes(id)
      ? selectedIds.filter((sid) => sid !== id)
      : [...selectedIds, id];

    setSelectedIds(newSelected);
    onSelect?.(data.filter((item) => newSelected.includes(item.id)));
  };

  const handleToggleColumn = (accessor: keyof T) => {
    const isVisible = visibleColumns.some((col) => col.accessor === accessor);
    const newColumns = isVisible
      ? visibleColumns.filter((col) => col.accessor !== accessor)
      : [...visibleColumns, columns.find((col) => col.accessor === accessor)!];

    setVisibleColumns(newColumns);
  };

  const pageCount = Math.ceil(total / pageSize);

  const handleFirstPage = () => onPageChange(0);
  const handlePrevious = () => onPageChange(currentPage - 1);
  const handleNext = () => onPageChange(currentPage + 1);
  const handleLastPage = () => onPageChange(pageCount - 1);

  return (
    <div className="text-black shadow rounded-md overflow-auto border select-none w-full bg-white">
      {/* Search Input */}
      <div className="p-4">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="w-full px-4 py-2 border border-gray-300 rounded"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            onPageChange(0); // reset page khi search
          }}
        />
      </div>

      {/* Column toggles */}
      <div className="h-[55px] md:h-[60px] px-5 md:flex justify-between items-center w-full">
        {columns.map((col) => (
          <label key={String(col.accessor)} className="text-sm flex items-center gap-1">
            <Checkbox
              checked={visibleColumns.some((v) => v.accessor === col.accessor)}
              onCheckedChange={() => handleToggleColumn(col.accessor)}
            />
            {col.header}
          </label>
        ))}
      </div>

      {/* Table */}
      <div>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100 hover:bg-gray-20">
              <TableHead className="text-black px-4 h-[46px] font-bold text-[13px]">
                <Checkbox checked={isAllSelected} onCheckedChange={toggleSelectAll} />
              </TableHead>
              {visibleColumns.map((col, idx) => (
                <TableHead className="text-black px-4 h-[46px] font-bold text-[13px]" key={idx}>
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="h-[46px] px-4 cursor-pointer whitespace-nowrap pl-5">
                  <Checkbox
                    checked={selectedIds.includes(row.id)}
                    onCheckedChange={() => toggleSelectOne(row.id)}
                  />
                </TableCell>
                {visibleColumns.map((col, idx) => (
                  <TableCell className="h-[46px] px-4 cursor-pointer whitespace-nowrap pl-5" key={idx}>
                    {String(row[col.accessor])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination and select control */}
      <div className="h-[60px] px-5 flex justify-between items-center border-t w-full">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm">Hiển thị:</label>
            <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue placeholder="Chọn số lượng" />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 15, 20, 50].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-gray-700">
            Đang chọn: {selectedIds.length} / {total}
          </div>
        </div>

        {/* Pagination controls */}
        <Pagination className="w-min mx-0">
          <PaginationContent>
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8"
                onClick={handleFirstPage}
                disabled={currentPage === 0}
              >
                <ChevronsLeft size={16} className="text-gray-700" />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8"
                onClick={handlePrevious}
                disabled={currentPage === 0}
              >
                <ChevronLeft size={16} className="text-gray-700" />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <span className="text-sm text-gray-700 px-2 whitespace-nowrap">
                Page {currentPage + 1} of {pageCount}
              </span>
            </PaginationItem>
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8"
                onClick={handleNext}
                disabled={currentPage >= pageCount - 1}
              >
                <ChevronRight size={16} className="text-gray-700" />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8"
                onClick={handleLastPage}
                disabled={currentPage >= pageCount - 1}
              >
                <ChevronsRight size={16} className="text-gray-700" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}