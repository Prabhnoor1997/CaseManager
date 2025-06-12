// DEVELOPMENT MODE: Authentication middleware disabled
// To re-enable authentication, uncomment the middleware code below

// import { withAuth } from 'next-auth/middleware';
// import { NextResponse } from 'next/server';

// export default withAuth(
//   function middleware(req) {
//     const token = req.nextauth.token;
//     const isAuthPage = req.nextUrl.pathname.startsWith('/login');
//     const isProtectedRoute = req.nextUrl.pathname.startsWith('/dashboard') ||
//                            req.nextUrl.pathname.startsWith('/cases') ||
//                            req.nextUrl.pathname.startsWith('/clients') ||
//                            req.nextUrl.pathname.startsWith('/documents') ||
//                            req.nextUrl.pathname.startsWith('/reports') ||
//                            req.nextUrl.pathname.startsWith('/settings');

//     // If user is on login page and is authenticated, redirect to dashboard
//     if (isAuthPage && token) {
//       return NextResponse.redirect(new URL('/dashboard', req.url));
//     }

//     // If user is trying to access protected route without authentication, redirect to login
//     if (isProtectedRoute && !token) {
//       return NextResponse.redirect(new URL('/login', req.url));
//     }

//     return NextResponse.next();
//   },
//   {
//     callbacks: {
//       authorized: ({ token, req }) => {
//         // Allow access to login page without token
//         if (req.nextUrl.pathname.startsWith('/login')) {
//           return true;
//         }

//         // Allow access to home page
//         if (req.nextUrl.pathname === '/') {
//           return true;
//         }

//         // For API routes, require token
//         if (req.nextUrl.pathname.startsWith('/api')) {
//           return !!token;
//         }

//         // For all other routes, require token
//         return !!token;
//       },
//     },
//   }
// );

// export const config = {
//   matcher: [
//     "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
//   ],
// };
