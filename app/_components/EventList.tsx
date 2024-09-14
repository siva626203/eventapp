import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface Attendee {
  id: string;
  name: string;
  email: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  attendees: Attendee[];
}

const EventList: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAttendees, setSelectedAttendees] = useState<Attendee[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/event', { params: { organizer: user?.email } });
        setEvents(response.data);
      } catch (error) {
        setError('Failed to fetch events.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user?.email]);

  const handleViewAttendees = (attendees: Attendee[]) => {
    setSelectedAttendees(attendees);
    setIsModalOpen(true);
  };

  const handleNotifyAttendee = (attendee: Attendee) => {
    // Handle notification logic here (e.g., sending an email or SMS)
    alert(`Notifying ${attendee.name} (${attendee.email})`);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Event List</h1>
      <div className="overflow-x-auto">
        <table className="w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border-b">ID</th>
              <th className="p-2 border-b">Name</th>
              <th className="p-2 border-b">Date</th>
              <th className="p-2 border-b">Location</th>
              <th className="p-2 border-b">Description</th>
              <th className="p-2 border-b">Attendees</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr key={event.id} className="hover:bg-gray-100">
                <td className="p-2 border-b">{index + 1}</td>
                <td className="p-2 border-b">{event.title}</td>
                <td className="p-2 border-b">{new Date(event.date).toLocaleDateString()}</td>
                <td className="p-2 border-b">{event.location}</td>
                <td className="p-2 border-b">{event.description}</td>
                <td className="p-2 border-b">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => handleViewAttendees(event.attendees)}
                  >
                    View Attendees
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-3/4">
            <h2 className="text-xl font-bold mb-4">Attendees</h2>
            <table className="w-full bg-white border border-gray-300 rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border-b">Name</th>
                  <th className="p-2 border-b">Email</th>
                  <th className="p-2 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {selectedAttendees.length > 0 ? (
                  selectedAttendees.map((attendee) => (
                    <tr key={attendee.id}>
                      <td className="p-2 border-b">{attendee.name}</td>
                      <td className="p-2 border-b">{attendee.email}</td>
                      <td className="p-2 border-b">
                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded"
                          onClick={() => handleNotifyAttendee(attendee)}
                        >
                          Notify
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center p-4">
                      No attendees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventList;
