import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Attendee {
  _id: string;
  name: string;
  email: string;
  rsvp?: boolean;
}

interface AttendeesTableProps {
  selectedAttendees: Attendee[];
  handleNotifyAttendee: (attendee: Attendee) => Promise<void>;
  eventId: string | null;
}

const AttendeesTable: React.FC<AttendeesTableProps> = ({ selectedAttendees, handleNotifyAttendee, eventId }) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [updatedAttendees, setUpdatedAttendees] = useState<Attendee[]>(selectedAttendees);
  const [newAttendee, setNewAttendee] = useState<{ name: string; email: string }>({ name: '', email: '' });

  if (eventId === null) {
    return <p>Error: Event ID is required.</p>;
  }

  // Function to handle saving attendees after edit mode
  const handleSaveClick = async () => {
    if (eventId === null || !Array.isArray(updatedAttendees)) {
      console.error('Invalid data');
      return;
    }
    try {
      await axios.put('/api/event', {
        id: eventId,
        attendees: updatedAttendees,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setEditMode(false); // Exit edit mode
      toast.info('Attendees updated successfully');
    } catch (error) {
      console.error('Error saving attendees:', error);
      toast.error('Error saving attendees');
    }
  };

  const handleDeleteClick = (attendeeId: string) => {
    setUpdatedAttendees(prev => prev.filter(a => a._id !== attendeeId));
  };

  const handleChange = (id: string, field: keyof Attendee, value: string) => {
    setUpdatedAttendees(prev =>
      prev.map(a => a._id === id ? { ...a, [field]: value } : a)
    );
  };

  const handleAddAttendee = () => {
    if (newAttendee.name && newAttendee.email) {
      const newId = `attendee-${Date.now()}`;
      setUpdatedAttendees(prev => [
        ...prev,
        { _id: newId, name: newAttendee.name, email: newAttendee.email }
      ]);
      setNewAttendee({ name: '', email: '' });
    } else {
      toast.error('Please enter both name and email.');
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border-b">Name</th>
            <th className="p-2 border-b">Email</th>
            <th className="p-2 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {updatedAttendees.length > 0 ? (
            updatedAttendees.map(attendee => (
              <tr key={attendee._id}>
                <td className="p-2 border-b">
                  {editMode ? (
                    <input
                      type="text"
                      value={attendee.name}
                      onChange={(e) => handleChange(attendee._id, 'name', e.target.value)}
                      className="border border-gray-300 p-1 rounded"
                    />
                  ) : (
                    attendee.name
                  )}
                </td>
                <td className="p-2 border-b">
                  {editMode ? (
                    <input
                      type="email"
                      value={attendee.email}
                      onChange={(e) => handleChange(attendee._id, 'email', e.target.value)}
                      className="border border-gray-300 p-1 rounded"
                    />
                  ) : (
                    attendee.email
                  )}
                </td>
                <td className="p-2 border-b">
                  {editMode ? (
                    <button
                      className="ml-2 bg-red-500 text-white px-4 py-2 rounded"
                      onClick={() => handleDeleteClick(attendee._id)}
                    >
                      Delete
                    </button>
                  ) : (
                    <>
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded"
                        onClick={() => handleNotifyAttendee(attendee)}
                      >
                        Notify
                      </button>
                      <button
                        className="ml-2 bg-yellow-500 text-white px-4 py-2 rounded"
                        onClick={() => setEditMode(true)}
                      >
                        Edit
                      </button>
                    </>
                  )}
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

      {/* Add Attendee Form */}
      {editMode && (
        <div className="mt-4">
          <input
            type="text"
            placeholder="Name"
            value={newAttendee.name}
            onChange={(e) => setNewAttendee(prev => ({ ...prev, name: e.target.value }))}
            className="border border-gray-300 p-2 rounded mr-2"
          />
          <input
            type="email"
            placeholder="Email"
            value={newAttendee.email}
            onChange={(e) => setNewAttendee(prev => ({ ...prev, email: e.target.value }))}
            className="border border-gray-300 p-2 rounded mr-2"
          />
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={handleAddAttendee}
          >
            Add Attendee
          </button>
        </div>
      )}

      {/* Save button when in edit mode */}
      {editMode && (
        <div className="mt-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleSaveClick}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default AttendeesTable;
