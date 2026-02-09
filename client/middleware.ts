import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/products/new'];

function isProtectedPath(pathname: string): boolean {
  if (protectedPaths.includes(pathname)) return true;
  if (/^\/products\/[^/]+\/edit$/.test(pathname)) return true;
  return false;
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  if (isProtectedPath(pathname) && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if ((pathname === '/login' || pathname === '/register') && token) {
    return NextResponse.redirect(new URL('/products', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/products/new', '/products/:id/edit', '/login', '/register'],
};
