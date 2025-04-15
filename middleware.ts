// import createMiddleware from 'next-intl/middleware';
// import { routing } from './i18n/routing';

// export default createMiddleware(routing);

// export const config = { matcher: ['/', '/(en|vi)/:path*'] };

// middleware.ts (hoặc middleware.js)
// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function middleware(request: NextRequest) {
//   const isAuthenticated = request.cookies.get('token')?.value; // Ví dụ: kiểm tra token trong cookie
  
//   // Định nghĩa các route cần bảo vệ
//   const protectedPaths = ['/dashboard', '/profile', '/settings'];
  
//   // Kiểm tra nếu request nằm trong protected paths
//   const isProtectedPath = protectedPaths.some(path => 
//     request.nextUrl.pathname.startsWith(path)
//   );

//   if (isProtectedPath && !isAuthenticated) {
//     // Chuyển hướng về login nếu chưa đăng nhập
//     return NextResponse.redirect(new URL('/login', request.url));
//   }

//   // Tiếp tục xử lý request nếu đã authenticated hoặc không phải protected route
//   return NextResponse.next();
// }

// // Cấu hình matcher để áp dụng middleware cho các route cụ thể
// export const config = {
//   matcher: ['/dashboard/:path*', '/profile/:path*', '/settings/:path*'],
// };


// // middleware.ts
// import { NextResponse, type NextRequest } from 'next/server';
// import createMiddleware from 'next-intl/middleware';
// import { routing } from './i18n/routing';

// // Tạo middleware cho i18n
// const intlMiddleware = createMiddleware(routing);

// // Middleware chính kết hợp i18n và auth
// export default function middleware(request: NextRequest) {
//   // 1. Xử lý i18n trước
//   const intlResponse = intlMiddleware(request);
  
//   // Nếu intlMiddleware trả về response (ví dụ: redirect do locale), dùng nó
//   if (intlResponse) {
//     return intlResponse;
//   }

//   // 2. Xử lý authentication
//   const isAuthenticated = request.cookies.get('token')?.value; // Kiểm tra token
  
//   // Định nghĩa các route cần bảo vệ
//   const protectedPaths = ['/dashboard', '/profile', '/settings'];
  
//   // Kiểm tra nếu request nằm trong protected paths
//   const isProtectedPath = protectedPaths.some(path =>
//     request.nextUrl.pathname.startsWith(path)
//   );

//   if (isProtectedPath && !isAuthenticated) {
//     // Chuyển hướng về login, giữ nguyên locale từ request
//     const loginUrl = new URL('/login', request.url);
//     return NextResponse.redirect(loginUrl);
//   }

//   // Tiếp tục xử lý request nếu đã authenticated hoặc không phải protected route
//   return NextResponse.next();
// }

// // Cấu hình matcher kết hợp cả i18n và protected routes
// export const config = {
//   matcher: [
//     // Matcher cho i18n
//     '/',
//     '/(en|vi)/:path*',
//     // Matcher cho protected routes
//     '/dashboard/:path*',
//     '/profile/:path*',
//     '/settings/:path*'
//   ]
// };


// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

// Danh sách các route cần bảo vệ
const protectedPaths = ['/dashboard', '/profile', '/settings'];

export default async function middleware(request: NextRequest) {
  // 1. Xử lý i18n trước
  const intlResponse = intlMiddleware(request);
  if (intlResponse) return intlResponse;

  // 2. Kiểm tra refresh token từ cookie
  const refreshToken = request.cookies.get('refreshToken')?.value; // Đổi tên nếu cần
  
  // Kiểm tra xem request có nằm trong protected paths không
  const isProtectedPath = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  );

  // 3. Nếu là protected path và không có refresh token, redirect về login
  if (isProtectedPath && !refreshToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 4. (Tùy chọn) Gọi API để kiểm tra tính hợp lệ của refresh token
  if (isProtectedPath && refreshToken) {
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/auth/verify-refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        // Nếu refresh token không hợp lệ, redirect về login
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (error) {
      console.error('Error verifying refresh token:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 5. Tiếp tục xử lý request nếu mọi thứ ổn
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/(en|vi)/:path*', '/dashboard/:path*', '/profile/:path*', '/settings/:path*']
};


// middleware.ts
// import { NextResponse, type NextRequest } from 'next/server';
// import createMiddleware from 'next-intl/middleware';
// import { routing } from './i18n/routing';

// const intlMiddleware = createMiddleware(routing);

// const protectedPaths = ['/dashboard', '/profile', '/settings'];

// export default function middleware(request: NextRequest) {
//   const intlResponse = intlMiddleware(request);
//   if (intlResponse) return intlResponse;

//   const refreshToken = request.cookies.get('refreshToken')?.value;
//   const isProtectedPath = protectedPaths.some(path =>
//     request.nextUrl.pathname.startsWith(path)
//   );

//   if (isProtectedPath && !refreshToken) {
//     return NextResponse.redirect(new URL('/login', request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/', '/(en|vi)/:path*', '/dashboard/:path*', '/profile/:path*', '/settings/:path*']
// };


// middleware.ts
// import { NextResponse, type NextRequest } from 'next/server';
// import createMiddleware from 'next-intl/middleware';
// import { routing } from './i18n/routing';

// const intlMiddleware = createMiddleware(routing);

// const protectedAdminPaths = ['/admin']; // Trang quản trị
// const protectedUserPaths = ['/dashboard', '/profile', '/settings']; // Các trang cần đăng nhập nhưng không cần role admin

// export default async function middleware(request: NextRequest) {
//   const intlResponse = intlMiddleware(request);
//   if (intlResponse) return intlResponse;

//   const refreshToken = request.cookies.get('refreshToken')?.value;
//   const isAdminPath = protectedAdminPaths.some(path => request.nextUrl.pathname.startsWith(path));
//   const isProtectedUserPath = protectedUserPaths.some(path => request.nextUrl.pathname.startsWith(path));

//   // Nếu không có refresh token và truy cập trang bảo vệ, redirect về login
//   if ((isAdminPath || isProtectedUserPath) && !refreshToken) {
//     return NextResponse.redirect(new URL('/login', request.url));
//   }

//   // Kiểm tra role cho trang admin
//   if (isAdminPath && refreshToken) {
//     try {
//       const response = await fetch(`${process.env.BACKEND_URL}/auth/me`, {
//         headers: {
//           'Cookie': `refreshToken=${refreshToken}`,
//         },
//       });
//       if (!response.ok) throw new Error('Invalid token');
      
//       const user = await response.json();
//       if (user.role !== 'admin') {
//         return NextResponse.redirect(new URL('/unauthorized', request.url));
//       }
//     } catch (error) {
//       return NextResponse.redirect(new URL('/login', request.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     '/',
//     '/(en|vi)/:path*',
//     '/dashboard/:path*',
//     '/profile/:path*',
//     '/settings/:path*',
//     '/admin/:path*',
//   ],
// };