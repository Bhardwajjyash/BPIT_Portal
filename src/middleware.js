import { NextResponse } from 'next/server';

export function middleware(request) {
  const userId = request.cookies.get('userId')?.value;
  const facultyId = request.cookies.get('facultyId')?.value;
  const path = request.nextUrl.pathname;

  // Protect Student portal routes
  if (path.startsWith('/student') && !userId) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Protect Faculty portal routes (excluding login page)
  if (path.startsWith('/faculty') && path !== '/faculty/login' && !facultyId) {
    return NextResponse.redirect(new URL('/faculty/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/student/:path*', '/faculty/:path*'],
};