import { googleCred } from '@/actions/google.actions';
import axios from 'axios';
import { NextResponse } from 'next/server';
import querystring from 'querystring';

export async function GET(req: Request) {

    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')

    const { data } = await axios.post('https://oauth2.googleapis.com/token', querystring.stringify({
        code,
        client_id: process.env.AUTH_GOOGLE_CLIENT_ID,
        client_secret: process.env.AUTH_GOOGLE_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
    }), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    const { access_token, refresh_token, expires_in } = data;

    // Calculate expiration time
    const expire_time = Date.now() + expires_in * 1000;

    await googleCred({
        google_access_token: access_token as string,
        google_refresh_token: refresh_token as string,
        google_access_token_expire_in: `${expire_time}`,
    })

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}`)
}