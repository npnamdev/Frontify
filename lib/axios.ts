// lib/axios.ts
import axios from 'axios';

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// Add access token to every request
api.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle token expiration
api.interceptors.response.use(
    res => res,
    async error => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes('/auth/refresh-token')
        ) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token: any) => {
                        originalRequest.headers['Authorization'] = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch(err => Promise.reject(err));
            }

            isRefreshing = true;

            try {
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-token`,
                    {},
                    { withCredentials: true } // send HttpOnly cookie
                );

                const newToken = response.data.accessToken;
                localStorage.setItem('accessToken', newToken);

                processQueue(null, newToken);

                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (err) {
                processQueue(err, null);
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);