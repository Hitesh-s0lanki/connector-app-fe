
"use client";
import React, { useState, useEffect } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { useGetCalendarEvents } from "@/actions/features/google.feature";
import { createGoogleCalendarEvent  } from "@/actions/google.actions";
import { Label } from "@/components/ui/label"

import { Dialog, DialogTitle, DialogTrigger,DialogContent,DialogDescription,DialogHeader,DialogFooter} from '../../../../components/ui/dialog'; // Make sure to install ShadCN and Tailwind CSS
import { Textarea } from '../../../../components/ui/textarea'; // Import the TextField component separately
import { Button } from '../../../../components/ui/button'; // Import the Button component separately
import '../styles/calendar.css'
import { Input } from "@/components/ui/input";

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
  
  const [eventTitle, setEventTitle] = useState("");
  const { data, isLoading, error } = useGetCalendarEvents("", "", "primary");

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

  const updateDate = ()=>{
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const defaultStartTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    const defaultEndTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour later
    const endHours = defaultEndTime.getHours();
    const endMinutes = defaultEndTime.getMinutes();
    const formattedEndTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
    
    setStartTime(defaultStartTime);
    setEndTime(formattedEndTime);

  }
    useEffect(() => {

      updateDate();
    }, []);

    const handleDateClick = (info) => {
      updateDate(); // Call updateDate to set the current time for startTime and endTime
      setSelectedDate(info.dateStr); // Set the selected date from the clicked tile
      setIsDialogOpen(true); // Open the dialog
    };
    

    const handleSaveEvent = async () => {
      const newEvent = {
        title: eventTitle,
        date:selectedDate,
        start: startTime,
        end: endTime,
        allDay: false, // Set based on whether it's an all-day event
      };
  
      try {
        await createGoogleCalendarEvent(newEvent); // Call action to send the event to the backend
        setIsDialogOpen(false);
        setEventTitle("");
      } catch (error) {
        console.error("Error saving event:", error);
      }
    };

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
        events={events}
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
        dateClick={handleDateClick} // Handle date click to open dialog
      />
      
      {/* Dialog for creating event */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Create Event</DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="eventName" className="text-right">
                Event Name
              </Label>
              <Input
                id="eventName"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                
                placeholder="Enter event name"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="eventDate" className="text-right">
                Date
              </Label>
              <Input
                id="eventDate"
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value)
                }}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="eventStartTime" className="text-right">
                Start Time
              </Label>
              <Input
                id="eventStartTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="col-span-3"
              />
              <Label htmlFor="eventEndTime" className="text-right">
                End Time
              </Label>
              <Input
                id="eventEndTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="eventDescription" className="text-right">
                Description
              </Label>
              <Textarea
                id="eventDescription"
                placeholder="Enter event description"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveEvent}>Save Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};


export default CalendarComponent;
