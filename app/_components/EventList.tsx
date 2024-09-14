import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  description: string;
}

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/event');
        setEvents(response.data);
      } catch (error) {
        setError('Failed to fetch events.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Event List</h1>
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border-b">ID</th>
            <th className="p-2 border-b">Name</th>
            <th className="p-2 border-b">Date</th>
            <th className="p-2 border-b">Location</th>
            <th className="p-2 border-b">Description</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="hover:bg-gray-100">
              <td className="p-2 border-b">{event.id}</td>
              <td className="p-2 border-b">{event.name}</td>
              <td className="p-2 border-b">{new Date(event.date).toLocaleDateString()}</td>
              <td className="p-2 border-b">{event.location}</td>
              <td className="p-2 border-b">{event.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventList;
