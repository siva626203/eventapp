import { NextResponse } from 'next/server';
import Event from '@/app/models/Event';
import connectToDatabase from '@/app/utils/dbconnect';

// Connect to MongoDB and handle verifying RSVP
export async function GET(request: Request) {
  await connectToDatabase();

  const url = new URL(request.url);
  const eventId = url.searchParams.get('eventId');
  const email = url.searchParams.get('email');

  if (!eventId || !email) {
    return NextResponse.json({ message: 'Event ID or Email is missing' }, { status: 400 });
  }

  try {
    // Find the event by ID
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    // Find the attendee by email
    const attendee = event.attendees.find((att: any) => att.email === email);

    if (!attendee) {
      return NextResponse.json({ message: 'Attendee not found' }, { status: 404 });
    }

    // Check if RSVP is already true
    if (attendee.rsvp === true) {
      return NextResponse.json({ message: 'RSVP already confirmed' }, { status: 200 });
    }

    // Update RSVP to true
    attendee.rsvp = true;
    await event.save();

    return NextResponse.json({ message: 'RSVP confirmed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error verifying RSVP:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
