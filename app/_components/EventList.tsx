import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { toast } from 'react-toastify';
import AttendeesTable from './AttendeesTable'; // Make sure to import the AttendeesTable component
import AddEventPopup from './AddEvent';

interface Attendee {
  _id: string;
  name: string;
  email: string;
  rsvp?: boolean;
}

interface Event {
  _id: string;
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
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);
  const [eventAdded, setEventAdded] = useState<boolean>(false);
const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
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
  }, [user?.email, isModalOpen, eventAdded]);

  const handleViewAttendees = (attendees: Attendee[], eventId: string) => {
    setCurrentEventId(eventId);
    setSelectedAttendees(attendees);
    setIsModalOpen(true);
  };

  const handleNotifyAttendee = async (attendee: Attendee) => {
    try {
      const response = await axios.post('/api/sendmail', {
        toAddress: attendee.email,
        subject: 'Event Notification',
        body: `Dear ${attendee.name},\n\nYou have been invited to an event.\n\nThank you!\n <a href="https://eventapp-siva.vercel.app/event/verify?eventId=${currentEventId}&email=${attendee.email}">Confirm your attendance</a>`,
      });

      if (response.status === 200) {
        toast.success(response.data.message);
      } else {
        console.error(response.data.message);
        alert(`Failed to notify ${attendee.name}`);
      }
    } catch (error) {
      console.error('Error notifying attendee:', error);
      alert(`Error notifying ${attendee.name}`);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await axios.delete(`/api/event`,{data:{id:eventId}});
      setEvents(events.filter(event => event._id !== eventId));
      toast.success('Event deleted successfully');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }
const handleEventAdded = () => {
    setEventAdded(prev => !prev); // Toggle the state to trigger useEffect
    setIsPopupOpen(false); // Close the popup after adding the event
  };
  return (
    <div className="container mx-auto p-4">
      
        <AddEventPopup onEventAdded={handleEventAdded} onClose={() => setIsPopupOpen(false)} />
      <h1 className="text-2xl font-bold mb-4">Event List</h1>
      <div className="overflow-x-auto">
        <table className="w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border-b">ID</th>
              <th className="p-2 border-b">Title</th>
              <th className="p-2 border-b">Date</th>
              <th className="p-2 border-b">Location</th>
              <th className="p-2 border-b">Description</th>
              <th className="p-2 border-b">Attendees</th>
              <th className="p-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr key={event._id} className="hover:bg-gray-100">
                <td className="p-2 border-b">{index + 1}</td>
                <td className="p-2 border-b">{event.title}</td>
                <td className="p-2 border-b">{new Date(event.date).toLocaleDateString()}</td>
                <td className="p-2 border-b">{event.location}</td>
                <td className="p-2 border-b">{event.description}</td>
                <td className="p-2 border-b">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => handleViewAttendees(event.attendees, event._id)}
                  >
                    View Attendees
                  </button>
                </td>
                <td className="p-2 border-b">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                    onClick={() => handleDeleteEvent(event._id)}
                  >
                    Delete
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
            <AttendeesTable
              selectedAttendees={selectedAttendees}
              handleNotifyAttendee={handleNotifyAttendee}
              eventId={currentEventId}
            />
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
