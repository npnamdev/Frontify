'use client';
import React from 'react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronDown, Search, Plus } from 'lucide-react';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Checkbox } from '@/components/ui/checkbox';

type Column<T> = { header: string; accessor: keyof T };

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
  isLoading?: boolean;
};

export default function ReusableTable<T extends { id: number | string, image?: string }>({ columns, data, pageSize, currentPage, total, onSelect, onPageChange, onPageSizeChange, selectedIds, setSelectedIds, searchInput, setSearchInput, isLoading }: ReusableTableProps<T>) {
  const [hiddenColumns, setHiddenColumns] = React.useState<Set<keyof T>>(new Set());

  const isAllSelected = data.length > 0 && data.every((d) => selectedIds.includes(d.id));

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
    setHiddenColumns(prev => {
      const newHiddenColumns = new Set(prev);
      if (newHiddenColumns.has(accessor)) {
        newHiddenColumns.delete(accessor);
      } else {
        newHiddenColumns.add(accessor);
      }
      return newHiddenColumns;
    });
  };

  const pageCount = Math.ceil(total / pageSize);
  const handleFirstPage = () => onPageChange(0);
  const handlePrevious = () => onPageChange(currentPage - 1);
  const handleNext = () => onPageChange(currentPage + 1);
  const handleLastPage = () => onPageChange(pageCount - 1);
  const visibleColumns = columns.filter(col => !hiddenColumns.has(col.accessor));

  return (
    <div className="text-black shadow rounded-md overflow-auto border select-none w-full bg-white">
      {/* Search Input */}
      <div className="px-4 h-[60px] flex justify-between items-center">
        <div className="relative hidden md:flex items-center">
          <Search
            className="absolute left-3 text-gray-600"
            size={18}
            strokeWidth={1.5}
          />
          <Input
            className="w-[380px] px-5 pl-10"
            type="text"
            placeholder="Tìm kiếm..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              onPageChange(0);
            }}
          />
        </div>

        <div className='flex items-center gap-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-4">
                Columns <ChevronDown className="ml-2 w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {columns.map((col) => (
                <DropdownMenuCheckboxItem
                  key={String(col.accessor)}
                  checked={!hiddenColumns.has(col.accessor)}
                  onCheckedChange={() => handleToggleColumn(col.accessor)}
                >
                  {col.header}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button className="px-2.5 gap-1 text-[13.5px]">
            <Plus strokeWidth="1.5" />
            Thêm người dùng
          </Button>
        </div>
      </div>

      {/* Table Body */}
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={visibleColumns.length + 1} className="text-center py-6">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleColumns.length + 1} className="text-center py-6">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="h-[46px] px-4 cursor-pointer whitespace-nowrap pl-5">
                    <Checkbox
                      checked={selectedIds.includes(row.id)}
                      onCheckedChange={() => toggleSelectOne(row.id)}
                    />
                  </TableCell>
                  {visibleColumns.map((col, idx) => (
                    <TableCell className="h-[46px] px-4 cursor-pointer whitespace-nowrap pl-5" key={idx}>
                      {col.accessor === 'username' ? (
                        <div className="flex items-center gap-2">
                          {row.image && (
                            <img
                              src={String(row.image)}
                              alt="avatar"
                              className="w-8 h-8 object-cover rounded-full"
                            />
                          )}
                          <span className='no-underline'>{String(row[col.accessor])}</span>
                        </div>
                      ) : col.accessor === 'image' ? null : (
                        <span className='no-underline'>{String(row[col.accessor])}</span>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Table Footer */}
      <div className="h-[60px] px-5 flex justify-between items-center border-t w-full">
        <div className="text-sm text-gray-700">
          Đang chọn: {selectedIds.length} / {total}
        </div>

        <div className='flex items-center gap-3'>
          <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
            <SelectTrigger className="w-[80px] h-9">
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

          <Pagination className="w-min mx-0">
            <PaginationContent>
              <PaginationItem>
                <Button variant="outline" size="icon" onClick={handleFirstPage} disabled={currentPage === 0}>
                  <ChevronsLeft size={16} className="text-gray-700" />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button variant="outline" size="icon" onClick={handlePrevious} disabled={currentPage === 0}>
                  <ChevronLeft size={16} className="text-gray-700" />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <span className="text-sm text-gray-700 px-2 whitespace-nowrap">
                  Trang {currentPage + 1} / {pageCount}
                </span>
              </PaginationItem>
              <PaginationItem>
                <Button variant="outline" size="icon" onClick={handleNext} disabled={currentPage >= pageCount - 1}>
                  <ChevronRight size={16} className="text-gray-700" />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button variant="outline" size="icon" onClick={handleLastPage} disabled={currentPage >= pageCount - 1}>
                  <ChevronsRight size={16} className="text-gray-700" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}