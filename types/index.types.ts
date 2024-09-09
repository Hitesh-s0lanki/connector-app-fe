export type User = {
    id: string;
    name: string;
    email: string;

    google_access_token: string | null
    google_refresh_token: string | null,
    google_access_token_expire_in: string | null
}

export type Inbox = {
    id: string;
    snippet: string;
    date: string;
    subject: string;
    name: string;
    from: string;
    cc: string[];
    body: string;
    read: boolean;
}

export type DriveFile = {
    id: string;
    name: string;
    mimeType: string;
}
export type CalendarEvent={
    id:string;
    summary:string;
    description:string;
    start:Date;
    end:Date;
    location:string;
    attendees:string[];
    organizer:string;
    status:string;
    visibility:string;
    recurrence:string;
    reminders:string;
    eventType:string;
    calendarId:string;
}
