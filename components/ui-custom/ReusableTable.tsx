'use client';
import React, { useState } from 'react';

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from '@/components/ui/select';
import {
  Pagination, PaginationContent, PaginationItem
} from '@/components/ui/pagination';
import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Command, CommandEmpty, CommandGroup, CommandItem, CommandList
} from "@/components/ui/command"
import {
  Popover, PopoverContent, PopoverTrigger
} from "@/components/ui/popover"
import {
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ChevronDown, Search, Plus, EllipsisVertical, Columns2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Checkbox } from '@/components/ui/checkbox';

type Column<T> = {
  header: string;
  accessor: keyof T;
  visible?: boolean; // thêm để kiểm soát cột mặc định
  type?: 'group' | 'image' | 'system' | 'badge';
};

type ActionOption = {
  value: string;
  label: string;
  icon?: React.ReactNode;
  action: (id: number | string) => void;
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
  isLoading?: boolean;
  options?: ActionOption[];
};

export default function ReusableTable<T extends { id: number | string, image?: string }>({
  columns, data, pageSize, currentPage, total, options,
  onSelect, onPageChange, onPageSizeChange,
  selectedIds, setSelectedIds, searchInput, setSearchInput, isLoading
}: ReusableTableProps<T>) {
  const [hiddenColumns, setHiddenColumns] = useState<Set<keyof T>>(
    new Set(columns.filter((col) => col.visible === false).map((col) => col.accessor))
  );

  const [openPopoverId, setOpenPopoverId] = useState<string | number | null>(null);
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
      const newHidden = new Set(prev);
      if (newHidden.has(accessor)) newHidden.delete(accessor);
      else newHidden.add(accessor);
      return newHidden;
    });
  };

  const visibleColumns = columns.filter(col => !hiddenColumns.has(col.accessor));
  const pageCount = Math.ceil(total / pageSize);
  const handleFirstPage = () => onPageChange(0);
  const handlePrevious = () => onPageChange(currentPage - 1);
  const handleNext = () => onPageChange(currentPage + 1);
  const handleLastPage = () => onPageChange(pageCount - 1);

  return (
    <div className="text-black shadow rounded-md overflow-auto border select-none w-full bg-white">
      {/* Search & Control */}
      <div className="px-4 h-[65px] flex justify-between items-center">
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-3 text-gray-600" size={18} strokeWidth={1.5} />
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
              <Button variant="outline" className='px-2.5'>
                <Columns2 strokeWidth={"1.75"} className="w-4 h-4" />
                Hiển thị cột <ChevronDown className="ml-1 w-4 h-4" />
              </Button>

            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
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

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100 h-[50px] whitespace-nowrap">
            <TableHead className="px-5 w-[45px]">
              <Checkbox checked={isAllSelected} onCheckedChange={toggleSelectAll} />
            </TableHead>
            {visibleColumns.map((col, idx) => (
              <TableHead key={idx} className="text-black px-4 font-bold text-[13px]">
                {col.header}
              </TableHead>
            ))}
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={visibleColumns.length + 2} className="text-center py-6">
                Đang tải dữ liệu...
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={visibleColumns.length + 2} className="text-center py-6">
                Không có dữ liệu
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={row.id} className={`h-[50px] py-0 ${selectedIds.includes(row.id) ? 'bg-gray-100' : ''}`}>
                <TableCell className="px-5 w-[45px] whitespace-nowrap">
                  <Checkbox
                    checked={selectedIds.includes(row.id)}
                    onCheckedChange={() => toggleSelectOne(row.id)}
                  />
                </TableCell>
                {visibleColumns.map((col, idx) => (
                  <TableCell key={idx} className="px-4 py-0 whitespace-nowrap">
                    {col.type === 'group' ? (
                      String(row[col.accessor])
                    ) : col.type === 'badge' ? (
                      <div
                        className={`rounded-lg px-2 py-1 text-xs w-min text-white ${row[col.accessor] ? 'bg-[#3eca65]' : 'bg-[#f45d5d]'
                          }`}
                      >
                        {row[col.accessor] ? 'Hoạt động' : 'Không hoạt động'}
                      </div>
                    ) : col.type === 'system' ? (
                      <div
                        className={`rounded-lg px-2 py-1 text-xs w-min text-white ${row[col.accessor] ? 'bg-[#3eca65]' : 'bg-[#f45d5d]'
                          }`}
                      >
                        {String(row[col.accessor])}
                      </div>
                    ) : (
                      <span className={`${col.accessor == "fullName" ? 'font-bold text-[13.5px]' : ''}`}>
                        {String(row[col.accessor])}
                      </span>
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  <Popover
                    open={openPopoverId === row.id}
                    onOpenChange={(isOpen) => setOpenPopoverId(isOpen ? row.id : null)}
                  >
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="icon" className="w-7 h-7 p-0">
                        <EllipsisVertical strokeWidth={1.25} className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent side="left" className="w-min p-0">
                      <Command>
                        <CommandList>
                          <CommandEmpty>Không tìm thấy tùy chọn.</CommandEmpty>
                          <CommandGroup>
                            {options?.map((option) => (
                              <CommandItem
                                key={option.value}
                                value={option.value}
                                onSelect={() => {
                                  setOpenPopoverId(null);
                                  option.action(row.id);
                                }}
                                className="flex items-center gap-1.5 whitespace-nowrap"
                              >
                                {option.icon}
                                {option.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="h-[65px] px-5 flex justify-between items-center border-t">
        <div className="text-sm text-gray-700">
          Đang chọn: {selectedIds.length} / {total}
        </div>
        <div className="flex items-center gap-3">
          <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="Chọn số lượng" />
            </SelectTrigger>
            <SelectContent className="min-w-[65px]">
              {[5, 10, 15, 20, 50].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button variant="outline" size="icon" onClick={handleFirstPage} disabled={currentPage === 0}>
                  <ChevronsLeft size={16} />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button variant="outline" size="icon" onClick={handlePrevious} disabled={currentPage === 0}>
                  <ChevronLeft size={16} />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <span className="text-sm text-gray-700 px-2">
                  Trang {currentPage + 1} / {pageCount}
                </span>
              </PaginationItem>
              <PaginationItem>
                <Button variant="outline" size="icon" onClick={handleNext} disabled={currentPage >= pageCount - 1}>
                  <ChevronRight size={16} />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button variant="outline" size="icon" onClick={handleLastPage} disabled={currentPage >= pageCount - 1}>
                  <ChevronsRight size={16} />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}