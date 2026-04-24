import {NextResponse} from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.name || !data.email || !data.phone || !data.checkIn || !data.checkOut) {
      return NextResponse.json({error: 'Missing required fields'}, {status: 400});
    }

    const body = Object.entries(data)
      .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
      .join('\n');

    // TODO: Add SMTP credentials or replace with Resend once the host provides an API key.
    // TODO: Initialize Stripe here when deposits/payment links are enabled.
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {user: process.env.SMTP_USER, pass: process.env.SMTP_PASS}
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'booking@farmelbaya.com',
        to: 'contact@farmelbaya.com',
        replyTo: data.email,
        subject: `New booking request - ${data.name} · ${data.checkIn}`,
        text: body
      });
    } else {
      console.log('New booking request', body);
    }

    return NextResponse.json({success: true});
  } catch {
    return NextResponse.json({error: 'Unable to send booking request'}, {status: 500});
  }
}
