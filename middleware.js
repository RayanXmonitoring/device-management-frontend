import { NextResponse } from 'next/server';

// Simplified middleware without Firebase
export async function middleware(request) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('authToken')?.value;

  // Public paths that don't require authentication
  const publicPaths = ['/login', '/register', '/forgot-password', '/api/auth'];
  const isPublicPath = publicPaths.some(p => path.startsWith(p));

  // If no token and trying to access protected route, redirect to login
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If token exists and trying to access public path, redirect to dashboard
  if (token && path === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Check user role for admin routes (simplified)
  if (token && path.startsWith('/admin')) {
    try {
      // Decode token to check role
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      const userRole = payload.role;
      
      if (userRole !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (error) {
      // If token invalid, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images).*)'],
};
