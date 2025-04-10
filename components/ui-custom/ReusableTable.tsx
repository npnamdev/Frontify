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

    return (
        <div className="w-full space-y-4">
            {/* Column toggles */}
            <div className="flex flex-wrap gap-4">
                {columns.map((col) => (
                    <label key={String(col.accessor)} className="text-sm flex items-center gap-1">
                        <input
                            type="checkbox"
                            checked={visibleColumns.some((v) => v.accessor === col.accessor)}
                            onChange={() => handleToggleColumn(col.accessor)}
                        />
                        {col.header}
                    </label>
                ))}
            </div>

            {/* Table */}
            <div className="text-black shadow rounded-md overflow-auto border select-none w-full bg-white">
                <Table>
                    <TableHeader>
                        <TableRow className='bg-gray-100 hover:bg-gray-20'>
                            <TableHead className='text-black px-4 h-[46px] font-bold text-[13px]'>
                                <input
                                    type="checkbox"
                                    checked={isAllSelected}
                                    onChange={toggleSelectAll}
                                />
                            </TableHead>
                            {visibleColumns.map((col, idx) => (
                                <TableHead className='text-black px-4 h-[46px] font-bold text-[13px]' key={idx}>{col.header}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell className='h-[46px] px-4 cursor-pointer whitespace-nowrap pl-5'>
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(row.id)}
                                        onChange={() => toggleSelectOne(row.id)}
                                    />
                                </TableCell>
                                {visibleColumns.map((col, idx) => (
                                    <TableCell className='h-[46px] px-4 cursor-pointer whitespace-nowrap pl-5' key={idx}>{String(row[col.accessor])}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination and selected info */}
            <div className="flex justify-between items-center flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <label className="text-sm">Hiển thị:</label>
                        <select
                            className="border rounded px-2 py-1 text-sm"
                            value={pageSize}
                            onChange={(e) => {
                                onPageSizeChange(Number(e.target.value));
                            }}
                        >
                            {[5, 10, 15, 20, 50].map((size) => (
                                <option key={size} value={size}>
                                    {size} người dùng/trang
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="text-sm text-gray-700">
                        Đang chọn: {selectedIds.length} / {total}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => onPageChange(0)}
                        disabled={currentPage === 0}
                        className="px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                        |«
                    </button>
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                        className="px-4 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="text-sm">
                        Page {currentPage + 1} of {pageCount}
                    </span>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage >= pageCount - 1}
                        className="px-4 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                        Next
                    </button>
                    <button
                        onClick={() => onPageChange(pageCount - 1)}
                        disabled={currentPage >= pageCount - 1}
                        className="px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                        »|
                    </button>
                </div>
            </div>
        </div>
    );
}