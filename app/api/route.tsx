import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'Authorization token missing or invalid' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1]; // Extract token from "Bearer [token]"

  try {
    // Verify the token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    // Respond with decoded user information if the token is valid
    return NextResponse.json({ message: 'Authorized', user: decoded });
  } catch (error) {
    // Respond with an error message if the token is invalid
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
}