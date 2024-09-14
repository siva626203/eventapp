import NextAuth, { NextAuthOptions, User as NextAuthUser, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import { connectToDatabase, db } from '../../utils/dbconnect'; // Adjust the path to your MongoDB client
import bcrypt from 'bcrypt';
import { AdapterUser } from 'next-auth/adapters';

// Define a custom user type
interface User {
  id: string;
  name: string;
  email: string;
}

// Function to verify user credentials
async function verifyUser(email: string, password: string): Promise<User | null> {
  await connectToDatabase();
  const user = await db.collection('users').findOne({ email });

  if (user && bcrypt.compareSync(password, user.password)) {
    return { id: user._id.toString(), name: user.name, email: user.email };
  }
  return null;
}

// Configure NextAuth with options
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('Missing credentials');
        }

        const user = await verifyUser(credentials.email, credentials.password);

        if (user) {
          return user;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token.sub) {
        session.user = {
          id: token.sub as string,
          name: token.name ?? '',
          email: token.email ?? '',
        } as NextAuthUser;
      }
      return session;
    },
    async jwt({ token, user }: { token: JWT; user?: User | AdapterUser }) {
      if (user) {
        token.sub = user.id as string;
        token.name = user.name as string;
        token.email = user.email as string;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin', // Custom sign-in page
  },
};

export default NextAuth(authOptions);
