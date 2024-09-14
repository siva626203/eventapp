import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string; // Adding 'id' property to the session user object
      name?: string | null;
      email?: string | null;
      role?: string | null;
    };
  }
}