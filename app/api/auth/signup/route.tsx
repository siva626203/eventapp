import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/utils/dbconnect'; // Adjust import paths as needed
import User from '@/app/models/User'; // Adjust import paths as needed
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Connect to the database
    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({ email, password: hashedPassword, name });

    // Save the user to the database
    await newUser.save();

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error during signup:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
