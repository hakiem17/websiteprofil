import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Simple check for /admin routes
    // In a real app, you would use createMiddlewareClient from @supabase/auth-helpers-nextjs
    // to validate the session securely.

    if (request.nextUrl.pathname.startsWith('/admin')) {
        // For now, allow access or redirect to login if we had one.
        // This is a placeholder for the auth logic.
        // const session = ...
        // if (!session) return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
