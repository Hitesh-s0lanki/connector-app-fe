"use client";
import React, { useState, useEffect } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { useGetCalendarEvents } from "@/actions/features/google.feature";
import '../styles/calendar.css'
const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const { data, isLoading, error } = useGetCalendarEvents("", "", "primary");
  console.log("this is from compooo",{events})

  
  useEffect(() => {
    if (data && data.calendarEvents) {
      const formattedEvents = data.calendarEvents.map((event: any) => ({
        title: event.summary,
        start: new Date(event.start),
        end: new Date(event.end),

      }));
      setEvents(formattedEvents);
    }
  }, [data]);

  if (isLoading) {
    return <div>Loading events...</div>;
  }

  if (error) {
    return <div>Error fetching events: {error.message}</div>;
  }

  return (
    <div style={{ height: '100vh', padding: '20px' }}>
     <FullCalendar 
  editable={true}
  selectable={true}
  plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
  initialView="dayGridMonth"
  headerToolbar={{
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
  }}
  events={events} // Use the events state
  eventColor='none'
  eventTextColor="#000000"
  height="100%"
  contentHeight="auto"
  aspectRatio={1.5}
  eventTimeFormat={{
    hour: 'numeric',
    minute: '2-digit',
    meridiem: 'short'
  }}
  slotLabelFormat={{
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }}
  slotMinTime="00:00:00"
  slotMaxTime="24:00:00"
  eventDidMount={(info) => {
    console.log("Event mounted:", info.event.title);
  }}
/>

    </div>
  );
};

export default CalendarComponent;
