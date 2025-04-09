"use client";

import React, { useState } from 'react';

interface User {
    id: number;
    username: string;
    email: string;
    password: string;
}

const mockData: User[] = [
    { id: 1, username: 'john_doe', email: 'john@example.com', password: 'password123' },
    { id: 2, username: 'jane_smith', email: 'jane@example.com', password: '123456' },
    { id: 3, username: 'alice_nguyen', email: 'alice@example.com', password: 'abc123' },
];

const UserTable: React.FC = () => {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const isAllChecked = selectedIds.length === mockData.length;

    const toggleSelectAll = () => {
        if (isAllChecked) {
            setSelectedIds([]);
        } else {
            setSelectedIds(mockData.map((user) => user.id));
        }
    };

    const toggleSelectOne = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    return (
        <div className="overflow-x-auto p-4">
            <table className="min-w-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2 border">
                            <input
                                type="checkbox"
                                checked={isAllChecked}
                                onChange={toggleSelectAll}
                            />
                        </th>
                        <th className="p-2 border text-left">Username</th>
                        <th className="p-2 border text-left">Email</th>
                        <th className="p-2 border text-left">Password</th>
                    </tr>
                </thead>
                <tbody>
                    {mockData.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                            <td className="p-2 border text-center">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(user.id)}
                                    onChange={() => toggleSelectOne(user.id)}
                                />
                            </td>
                            <td className="p-2 border">{user.username}</td>
                            <td className="p-2 border">{user.email}</td>
                            <td className="p-2 border">{user.password}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;
