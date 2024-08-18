import { NextResponse } from 'next/server';
import querystring from 'querystring';

export async function GET() {
  try {

    // Define the required scopes
    const scope = 'w_member_social email';

    const params = querystring.stringify({
      client_id: process.env.AUTH_LINKEDIN_CLIENT_ID,
      redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
      response_type: 'code',
      scope,
      access_type: 'offline',
      prompt: 'consent',
    });

    return NextResponse.redirect(`https://www.linkedin.com/oauth/v2/authorization?${params}`);

  } catch (error: any) {
    console.error('Error during Google OAuth redirect:', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
