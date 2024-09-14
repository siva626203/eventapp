'use client';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '../featureSlice/authReducer';
const Header: React.FC = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  // Function to handle logout
  const handleLogout = () => {
    sessionStorage.removeItem('authToken'); // Or use cookies/localStorage
    dispatch(logout()); // Clear the auth state in Redux
    setAuthToken(null); // Update the local state
    router.push('/'); // Redirect to home page or login page
  };
  return (
    <header className="bg-blue-600 text-white py-3">
      <nav className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Event Management</h1>
        <div>
          {token ? (
            <>
              <Link href="/dashboard" className="px-4 py-2 text-lg hover:bg-blue-700 rounded">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-lg bg-red-600 hover:bg-red-700 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/signin" className="px-4 py-2 text-lg hover:bg-blue-700 rounded">
                Sign In
              </Link>
              <Link href="/signup" className="px-4 py-2 text-lg hover:bg-blue-700 rounded">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
