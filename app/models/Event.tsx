import { Schema, model, Document } from 'mongoose';
import User from './User'; // Adjust the path as needed

interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  location: string;
  organizer: string;
  attendees: Schema.Types.ObjectId[]; // Array of ObjectId references to User
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  organizer: {
    type: String,
    required: true,
    trim: true,
  },
  attendees: [{
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
  }],
}, {
  timestamps: true,
});

// Create and export the Event model
const Event = model<IEvent>('Event', eventSchema);

export default Event;
