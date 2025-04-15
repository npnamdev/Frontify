// components/Navbar.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface User {
    username: string;
    avatar: string;
    role: string;
}

interface NavbarProps {
    user: User | null;
}

export default function Navbar({ user: initialUser }: NavbarProps) {
    const [user, setUser] = useState<User | null>(initialUser);

    return (
        <nav>
            <Link href="/">Trang chủ</Link>
            <Link href="/contact">Liên hệ</Link>

            {user ? (
                <div>
                    <img src={user.avatar} alt="Avatar" width={40} height={40} />
                    <span>{user.username}</span>
                    {user.role === 'admin' && <Link href="/admin">Trang quản trị</Link>}
                    <button onClick={() => {/* Xử lý logout */ }}>Đăng xuất</button>
                </div>
            ) : (
                <div>
                    <Link href="/register">Đăng ký</Link>
                    <Link href="/login">Đăng nhập</Link>
                </div>
            )}
        </nav>
    );
}