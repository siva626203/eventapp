// Update your MongoDB client configuration in your NextAuth or API route

import { MongoClient } from 'mongodb';

// Create a MongoDB client instance
const client = new MongoClient(process.env.MONGODB_URI!);

// Create a variable to hold the database connection
let db: any;

// Function to connect to the database
const connectToDatabase = async () => {
  if (!db) {
    await client.connect();
    db = client.db('your-database-name'); // Replace with your database name
  }
};

// Export the database connection function
export { connectToDatabase, db };
