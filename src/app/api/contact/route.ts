import { NextResponse } from 'next/server';
import { sendContactEmail, EmailData } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const data = await request.json() as EmailData;
    
    await sendContactEmail(data);
    
    return NextResponse.json({ message: 'Email sent successfully' });
    
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to send email' },
      { status: 500 }
    );
  }
} 