import { NextApiRequest } from 'next';

interface DecodedUser {
  id: string;
  name: string;
  email: string;
  role: string; // Add other fields as necessary
}

// Extending NextApiRequest to include user
declare module 'next' {
  interface NextApiRequest {
    user?: DecodedUser;
  }
}