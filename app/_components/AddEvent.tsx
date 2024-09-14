import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
const AddEventPopup = () => {
 const { user } = useSelector((state: RootState) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [attendees, setAttendees] = useState([{ name: '', email: '', phone: '',rsvp:false }]);

  // Function to handle changing attendee input values
  const handleAttendeeChange = (index: number, field: 'name' | 'email' | 'phone', value: string) => {
    const newAttendees = [...attendees];
    newAttendees[index][field] = value;
    setAttendees(newAttendees);
  };

  // Function to add a new attendee
  const handleAddAttendee = () => {
    setAttendees([...attendees, { name: '', email: '', phone: '',rsvp:false }]);
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/event', {
        title: eventName,
        description: eventDescription,
        date: eventDate,
        location: eventLocation,
        attendees,
        organizer:user?.email
      });
      toast.success('Event added');
    } catch (error) {
      alert('Failed to add event.');
    }

    setIsModalOpen(false);
    setEventName('');
    setEventDate('');
    setEventDescription('');
    setEventLocation('');
  };

  return (
    <div>
      {/* Button to open the modal */}
      <button
        className="px-4 py-2 mt-10 ml-10 bg-blue-600 text-white rounded"
        onClick={() => setIsModalOpen(true)}
      >
        Add Event
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div
            className="bg-white p-6 rounded shadow-lg w-1/2 max-h-[80vh] overflow-y-auto" // Width set to 50% and scroll enabled
          >
            <h2 className="text-2xl font-bold mb-4">Add New Event</h2>

            <form onSubmit={handleAddEvent}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Event Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Event Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  className="w-full px-3 py-2 border rounded"
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  required
                />
              </div>

              {/* Attendees Section */}
              <h3 className="text-xl font-semibold mb-4">Attendees</h3>
              {attendees.map((attendee, index) => (
                <div key={index} className="mb-4">
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      className="w-1/3 px-3 py-2 border rounded"
                      placeholder="Name"
                      value={attendee.name}
                      onChange={(e) => handleAttendeeChange(index, 'name', e.target.value)}
                      required
                    />
                    <input
                      type="email"
                      className="w-1/3 px-3 py-2 border rounded"
                      placeholder="Email"
                      value={attendee.email}
                      onChange={(e) => handleAttendeeChange(index, 'email', e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      className="w-1/3 px-3 py-2 border rounded"
                      placeholder="Phone"
                      value={attendee.phone}
                      onChange={(e) => handleAttendeeChange(index, 'phone', e.target.value)}
                      required
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="mb-4 px-3 py-2 bg-blue-600 text-white rounded"
                onClick={handleAddAttendee}
              >
                + Add Attendee
              </button>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="px-4 py-2 mr-2 bg-gray-300 rounded"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddEventPopup;
