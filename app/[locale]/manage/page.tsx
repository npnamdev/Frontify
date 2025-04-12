'use client';

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import ReusableTable from '../../../components/ui-custom/ReusableTable';
import SelectDemo from '../../../components/ui-custom/SelectDemo';

type User = {
  id: number;
  username: string;
  email: string;
  role: string;
  phone: string;
  age: number;
  address: string;
  ip: string; 
};

type Column<T> = {
  header: string;
  accessor: keyof T;
};

const columns: Column<User>[] = [
  { header: 'Tên người dùng', accessor: 'username' },
  { header: 'Email', accessor: 'email' },
  { header: 'Vai trò', accessor: 'role' },
  { header: 'Số điện thoại', accessor: 'phone' },
  { header: 'Ip', accessor: 'ip' },
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

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const searchQuery = debouncedSearch
    ? `/search?q=${debouncedSearch}`
    : `?limit=${pageSize}&skip=${page * pageSize}`;
  const url = `https://dummyjson.com/users${searchQuery}`;

  const { data, isLoading } = useSWR(url, fetcher);

  const users: User[] = (data?.users || []).map((user: any) => ({
    ...user,
    address: user.address.city,
  }));

  const total = data?.total || 0;

  return (
    <div className="p-6 space-y-4">
      {/* <SelectDemo /> */}
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
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        isLoading={isLoading} // Thêm dòng này
      />
    </div>
  );
}