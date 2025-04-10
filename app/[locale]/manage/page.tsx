'use client';

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import ReusableTable from '../../../components/ui-custom/ReusableTable';

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  phone: string;
  age: number;
  address: {
    city: string;
  };
};

type Column<T> = {
  header: string;
  accessor: keyof T;
};

const columns: Column<User>[] = [
  { header: 'Họ', accessor: 'firstName' },
  { header: 'Tên', accessor: 'lastName' },
  { header: 'Email', accessor: 'email' },
  { header: 'Giới tính', accessor: 'gender' },
  { header: 'Số điện thoại', accessor: 'phone' },
  { header: 'Tuổi', accessor: 'age' },
  { header: 'Thành phố', accessor: 'address' },
];

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function App() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce logic
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(0); // Reset trang về 0 khi tìm kiếm
    }, 500); // Đợi 500ms không gõ mới set lại

    return () => clearTimeout(timeout);
  }, [searchInput]);

  // Build URL
  const searchQuery = debouncedSearch
    ? `/search?q=${debouncedSearch}`
    : `?limit=${pageSize}&skip=${page * pageSize}`;
  const url = `https://dummyjson.com/users${searchQuery}`;

  const { data, isLoading } = useSWR(url, fetcher);

  const users: User[] = (data?.users || []).map((user: User) => ({
    ...user,
    address: user.address.city,
  }) as unknown as User);

  const total = data?.total || 0;

  return (
    <div className="p-6 space-y-4">
      {/* Ô tìm kiếm */}
      <div className="max-w-sm">
        <input
          type="text"
          placeholder="Tìm kiếm người dùng..."
          className="w-full px-4 py-2 border border-gray-300 rounded"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      {isLoading ? (
        <p>Đang tải...</p>
      ) : (
        <ReusableTable<User>
          columns={columns}
          data={users}
          pageSize={pageSize}
          currentPage={page}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(0);
          }}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
        />
      )}
    </div>
  );
}