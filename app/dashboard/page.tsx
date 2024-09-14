'use client';

import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useRouter } from 'next/navigation';
import EventList from '../_components/EventList'
import AddEventPopup from '../_components/AddEvent';
import { useEffect } from 'react';
const Dashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
useEffect(()=>{
  if(!user?.email){
    router.push('/signin')
  }
},[user])
  return (
    <><div className="flex items-center justify-center ">

      <div className=" bg-white p-8 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Dashboard</h1>
        {user ? (
          <div>
            <p className="text-center mb-4">Welcome, {user.name}!</p>
            <EventList />
          </div>
        ) : (
          <p className="text-center mb-4">You are not logged in.</p>
        )}
      </div>
    </div></>
  );
};

export default Dashboard;
