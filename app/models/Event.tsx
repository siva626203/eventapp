import { Schema, model, models, Document } from 'mongoose';
import User from './User'; // Adjust the path as needed

interface IAttendee {
  name: string;
  email: string;
  phone: string;
}

interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  location: string;
  organizer: string;
  attendees: IAttendee[]; // Array of attendee objects
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
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    }
  }],
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Check if the model is already compiled
const Event = models.Event || model<IEvent>('Event', eventSchema);

export default Event;
