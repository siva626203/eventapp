// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

// Define paths that should be protected
const protectedRoutes = ['/dashboard', '/admin'];

export function middleware(req: NextRequest) {
  const tokenCookie = req.cookies.get('authToken'); // Get the cookie

  // Check if the request path is a protected route
  if (protectedRoutes.includes(req.nextUrl.pathname)) {
    if (!tokenCookie) {
      return NextResponse.redirect(new URL('/signin', req.url));
    }

    try {
      const token = tokenCookie.value; // Extract the token value
      // Verify the JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

      // Create a new response
      const response = NextResponse.next();

      // Attach user info in a custom header
      response.headers.set('x-user-data', JSON.stringify(decoded));

      return response;
    } catch (err) {
      console.error('Token verification error:', err);
      return NextResponse.redirect(new URL('/signin', req.url));
    }
  }

  // Allow the request to proceed for non-protected routes
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/admin'],
};
