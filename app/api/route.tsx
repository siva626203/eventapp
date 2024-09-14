import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken"; // Correct import for jsonwebtoken

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if the authorization header exists
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization token missing or invalid' });
  }

  const token = authHeader.split(' ')[1]; // Get the token after 'Bearer '

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string); // Use jwt.verify correctly
    // Attach user info to request object
    req.user = decoded as any; // Type it based on your user schema or type

    // Continue processing the request based on user data
    return res.status(200).json({ message: 'Authorized', user: req.user });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
