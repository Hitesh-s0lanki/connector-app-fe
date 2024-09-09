// calendar.component.tsx
"use client";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { useState, useEffect } from "react";
import { useGetCalendarEvents } from "@/actions/features/google.feature";

const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  
  // Use the custom hook to fetch events
  const { data, isLoading, error } = useGetCalendarEvents("", "eventType", "calendarId");

  useEffect(() => {
    if (data && data.calendarEvents) {
      // Transform the data to the format required by react-big-calendar
      const formattedEvents = data.calendarEvents.map((event: any) => ({
        title: event.summary,
        start: new Date(event.start),
        end: new Date(event.end),
        allDay: !event.start.dateTime, // Check if it's an all-day event
      }));
      setEvents(formattedEvents);
    }
  }, [data]);

  if (isLoading) {
    return <p>Loading events...</p>;
  }

  if (error) {
    return <p>Error fetching events: {error.message}</p>;
  }

  return (
    <div style={{ height: 600 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  );
};

export default CalendarComponent;
