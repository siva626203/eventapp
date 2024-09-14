'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout } from "../featureSlice/authReducer";
import { useRouter } from 'next/navigation';
import EventList from '../_components/EventList'
const Dashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  return (
    <div className="flex items-center justify-center my-10">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Dashboard</h1>
        {user ? (
          <div>
            <p className="text-center mb-4">Welcome, {user.name}!</p>
            <button
              onClick={handleLogout}
              className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <EventList/>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
