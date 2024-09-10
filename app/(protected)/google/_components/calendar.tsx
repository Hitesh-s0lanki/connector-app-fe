"use client";
import { Calendar, momentLocalizer ,Views} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { useState, useEffect } from "react";
import { useGetCalendarEvents } from "@/actions/features/google.feature";
import { Button } from "@/components/ui/button";  // Example ShadCN component
import  DatePickerDemo  from "@/components/ui/datepicker";  // ShadCN DatePicker example

const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const { data, isLoading, error } = useGetCalendarEvents("", undefined, "primary");
  const [currentView, setCurrentView] = useState(Views.MONTH); // Initial view is set to "Month"

  useEffect(() => {
    if (data && data.calendarEvents) {
      const formattedEvents = data.calendarEvents.map((event: any) => ({
        title: event.summary,
        start: new Date(event.start),
        end: new Date(event.end),
        allDay: !event.start.dateTime,
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
    <div className="p-6 bg-gray-50 h-screen">
      <div className="flex items-center justify-between mb-4">
        <Button className="bg-blue-600 text-white hover:bg-blue-700">
          Create Event
        </Button>
        <DatePickerDemo className="border-gray-300 rounded-lg" />
      </div>
      <div className="h-[750px]">
      <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%", width: "100%" }}
          className="shadow-md border border-gray-200 rounded-lg"
          views={['month', 'week', 'day', 'agenda']}  // Enable Month, Week, Day, and Agenda views
          view={currentView}  // Set the current view
          onView={(view) => setCurrentView(view)}  // Update the view when clicked
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: "#4285f4",  // Google Calendar blue color
              borderRadius: "8px",
              color: "white",
              border: "none",
            },
          })}
        />
      </div>
    </div>
  );
};

export default CalendarComponent;
