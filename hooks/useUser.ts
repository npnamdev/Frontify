import { useEffect, useState } from 'react';

export function useUser() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/auth/me', {
            credentials: 'include'
        })
            .then(res => res.ok ? res.json() : null)
            .then(data => setUser(data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    return { user, loading };
}


// import { useEffect, useState } from 'react';
// import { api } from '@/lib/axios'; // Đảm bảo bạn đã config axios instance ở đây

// export function useUser() {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const getUser = async () => {
//             try {
//                 const response = await api.get('/auth/me', {
//                     withCredentials: true // Gửi cookie HttpOnly nếu có
//                 });
//                 setUser(response.data);
//             } catch (error) {
//                 setUser(null);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         getUser();
//     }, []);

//     return { user, loading };
// }