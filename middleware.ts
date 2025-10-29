import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const role = req.cookies.get('role')?.value;
  // allow login page
  if (url.pathname.startsWith('/login') || url.pathname.startsWith('/api')) {
    return NextResponse.next();
  }
  if (role !== 'admin') {
    const loginUrl = new URL('/login', url);
    loginUrl.searchParams.set('next', url.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
