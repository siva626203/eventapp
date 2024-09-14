import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";

// Define metadata if needed
export const metadata: Metadata = {
  title: "Event Management System",
  description: "Manage your events with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="bg-blue-600 text-white py-3">
          <nav className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Event Management</h1>
            <div>
              <Link href="/signin" className="px-4 py-2 text-lg hover:bg-blue-700 rounded">
                Sign In
              </Link>
              <Link href="/signup" className="px-4 py-2 text-lg hover:bg-blue-700 rounded">
                Sign Up
              </Link>
            </div>
          </nav>
        </header>
        <main>{children}</main> {/* Wrap the children with <main> for better semantics */}
      </body>
    </html>
  );
}
