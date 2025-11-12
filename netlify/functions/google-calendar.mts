import type { Context, Config } from "@netlify/functions";
import { google } from 'googleapis';

interface CalendarEvent {
  id?: string;
  summary?: string;
  start?: {
    dateTime?: string;
    date?: string;
  };
  end?: {
    dateTime?: string;
    date?: string;
  };
  description?: string;
}

export default async (req: Request, context: Context) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers });
  }

  try {
    const { method } = req;
    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    // Initialize Google OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      Netlify.env.GOOGLE_CLIENT_ID,
      Netlify.env.GOOGLE_CLIENT_SECRET,
      `${url.origin}/api/google-calendar/callback`
    );

    switch (action) {
      case 'auth-url':
        // Generate OAuth URL for user authorization
        const authUrl = oauth2Client.generateAuthUrl({
          access_type: 'offline',
          scope: [
            'https://www.googleapis.com/auth/calendar.readonly',
            'https://www.googleapis.com/auth/calendar.events'
          ],
          prompt: 'consent'
        });
        
        return new Response(JSON.stringify({ authUrl }), {
          status: 200,
          headers
        });

      case 'callback':
        // Handle OAuth callback
        const code = url.searchParams.get('code');
        if (!code) {
          return new Response(JSON.stringify({ error: 'No authorization code provided' }), {
            status: 400,
            headers
          });
        }

        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        return new Response(JSON.stringify({
          message: 'Authorization successful',
          tokens: {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expiry_date: tokens.expiry_date
          }
        }), {
          status: 200,
          headers
        });

      case 'events':
        // Get calendar events
        if (method !== 'POST') {
          return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers
          });
        }

        const { access_token, refresh_token } = await req.json();
        if (!access_token) {
          return new Response(JSON.stringify({ error: 'Access token required' }), {
            status: 400,
            headers
          });
        }

        oauth2Client.setCredentials({
          access_token,
          refresh_token
        });

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
        
        const now = new Date();
        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);

        const eventsResponse = await calendar.events.list({
          calendarId: 'primary',
          timeMin: now.toISOString(),
          timeMax: endOfDay.toISOString(),
          maxResults: 10,
          singleEvents: true,
          orderBy: 'startTime'
        });

        const events: CalendarEvent[] = eventsResponse.data.items || [];
        
        return new Response(JSON.stringify({
          events: events.map(event => ({
            id: event.id,
            summary: event.summary,
            start: event.start,
            end: event.end,
            description: event.description
          }))
        }), {
          status: 200,
          headers
        });

      case 'create-event':
        // Create a new calendar event
        if (method !== 'POST') {
          return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers
          });
        }

        const body = await req.json();
        const { access_token: createToken, refresh_token: createRefresh, event } = body;
        
        if (!createToken || !event) {
          return new Response(JSON.stringify({ error: 'Access token and event data required' }), {
            status: 400,
            headers
          });
        }

        oauth2Client.setCredentials({
          access_token: createToken,
          refresh_token: createRefresh
        });

        const calendarCreate = google.calendar({ version: 'v3', auth: oauth2Client });
        
        const createdEvent = await calendarCreate.events.insert({
          calendarId: 'primary',
          requestBody: event
        });

        return new Response(JSON.stringify({
          message: 'Event created successfully',
          event: createdEvent.data
        }), {
          status: 200,
          headers
        });

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers
        });
    }
  } catch (error) {
    console.error('Google Calendar API error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers
    });
  }
};

export const config: Config = {
  path: "/api/google-calendar"
};