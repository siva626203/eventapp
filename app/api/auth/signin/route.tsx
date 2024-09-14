import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/app/utils/dbconnect'; 
import User from '@/app/models/User'; 

// Function to verify user credentials
async function verifyUser(email: string, password: string) {
  await connectToDatabase();
  const user = await User.findOne({ email });

  if (user && bcrypt.compareSync(password, user.password)) {
    return { id: user._id.toString(), name: user.name, email: user.email };
  }
  return null;
}

// Named export for POST method
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
    }

    const user = await verifyUser(email, password);

    if (user) {
      // Generate a JWT token
      const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email },
        process.env.JWT_SECRET as string, // Ensure JWT_SECRET is in your .env file
        { expiresIn: '1h' }
      );

      return NextResponse.json({ token,user }, { status: 200 });
    }

    return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
  } catch (error) {
    console.error('Error in signin:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
