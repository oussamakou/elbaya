import {NextResponse} from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.email) return NextResponse.json({error: 'Email is required'}, {status: 400});

    // TODO: Connect this waitlist to Mailchimp, Brevo, or the owner's preferred email tool.
    console.log('Waitlist signup', data);
    return NextResponse.json({success: true});
  } catch {
    return NextResponse.json({error: 'Unable to join waitlist'}, {status: 500});
  }
}
