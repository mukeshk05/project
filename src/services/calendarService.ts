import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

const oauth2Client = new OAuth2Client(
  import.meta.env.VITE_GOOGLE_CLIENT_ID,
  import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
  import.meta.env.VITE_GOOGLE_REDIRECT_URI
);

interface TravelEvent {
  summary: string;
  location: string;
  description: string;
  start: Date;
  end: Date;
  attendees?: string[];
}

export const addToGoogleCalendar = async (event: TravelEvent, accessToken: string) => {
  try {
    oauth2Client.setCredentials({ access_token: accessToken });
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Use GPT to generate a detailed event description
    const openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4.5-preview-2025-02-27",
      messages: [
        {
          role: "system",
          content: "Generate a detailed travel itinerary description for a calendar event."
        },
        {
          role: "user",
          content: `Create a detailed description for a trip to ${event.location} from ${event.start} to ${event.end}`
        }
      ]
    });

    const enhancedDescription = response.choices[0].message.content;

    const calendarEvent = {
      summary: event.summary,
      location: event.location,
      description: enhancedDescription,
      start: {
        dateTime: event.start.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: event.end.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      attendees: event.attendees?.map(email => ({ email })),
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 24 * 60 },
          { method: 'popup', minutes: 2 * 24 * 60 }
        ],
      },
    };

    const result = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: calendarEvent,
    });

    return result.data;
  } catch (error) {
    console.error('Error adding event to Google Calendar:', error);
    throw error;
  }
};

export default {
  addToGoogleCalendar,
};