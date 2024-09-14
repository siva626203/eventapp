import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function POST(request: Request) {
  try {
    const { toAddress, subject, body } = await request.json();

    if (!toAddress || !subject || !body) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Default value if SOURCE_EMAIL_ADDRESS is undefined
    const fromAddress = process.env.SOURCE_EMAIL_ADDRESS ?? 'default-email@example.com';

    const msg = {
      to: toAddress,
      from: fromAddress, // fromAddress is now a string
      subject: subject,
      text: body,
    };

    const res=await sgMail.send(msg);
    console.log(res)
    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.error();
  }
}
