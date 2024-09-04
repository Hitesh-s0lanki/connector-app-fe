import { NextResponse } from 'next/server';
import querystring from 'querystring';

export async function GET() {
  try {
    const params = querystring.stringify({
      client_id: process.env.AUTH_GOOGLE_CLIENT_ID,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      response_type: 'code',
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://mail.google.com',
        'https://www.googleapis.com/auth/drive.readonly',
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
      ].join(' '),
      access_type: 'offline',
      prompt: 'consent',
    });

    return NextResponse.redirect(`https://accounts.google.com/o/oauth2/auth?${params}`);
  } catch (error: any) {
    console.error('Error during Google OAuth redirect:', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
