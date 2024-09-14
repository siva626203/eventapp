// app/api/event/route.ts
import { NextResponse } from 'next/server';
import Event from '@/app/models/Event';
import  connectToDatabase  from '@/app/utils/dbconnect';
import { NextApiRequest } from 'next/types';

// Connect to MongoDB


// Handler function for events
export async function GET(request: Request) {
  await connectToDatabase();

  const url = new URL(request.url);
  const organizer = url.searchParams.get('organizer');

  if (organizer) {
    try {
      const event = await Event.find({organizer:organizer});
      
      if (!event) {
        return NextResponse.json({ message: 'Event not found' }, { status: 404 });
      }
      
      return NextResponse.json(event);
    } catch (error) {
      return NextResponse.error();
    }
  } else {
    // Handle listing all events if no ID is provided
    try {
      const events = await Event.find().populate('attendees');
      return NextResponse.json(events);
    } catch (error) {
      return NextResponse.error();
    }
  }
}

export async function POST(request: Request) {
  await connectToDatabase();

  try {
    const { title, description, date, location, organizer, attendees } = await request.json();
    
    const newEvent = new Event({
      title,
      description,
      date,
      location,
      organizer,
      attendees
    });

    const savedEvent = await newEvent.save();
    return NextResponse.json(savedEvent);
  } catch (error) {
    return NextResponse.error();
  }
}

export async function PUT(request: Request) {
  await connectToDatabase();

  try {
    const data = await request.json();
    console.log('Request data:', data);

    const { id, title, description, date, location, organizer, attendees } = data;

    if (!id) {
      return NextResponse.json({ message: 'ID is required' }, { status: 400 });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { title, description, date, location, organizer, attendees },
      { new: true }
    ).populate('attendees');

    if (!updatedEvent) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.error();
  }
}

export async function DELETE(request: Request) {
  await connectToDatabase();

  try {
    const { id } = await request.json();

    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    return NextResponse.error();
  }
}
