"use client";
import React, { useState, useEffect, useCallback } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getCalendarEvents, createGoogleCalendarEvent, deleteGoogleCalendarEvent ,updateGoogleCalendarEvent } from "@/actions/google.actions";
import { Label } from "@/components/ui/label";
import { Dialog, DialogTitle, DialogContent, DialogDescription, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { X, Pencil, Trash2 } from 'lucide-react';
import immg from '@/public/icons/meet.png'

import '../styles/calendar.css'
import Image from "next/image";
const CalendarComponent = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventTitle, setEventTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery(
    ["calendarEvents"],
    () => getCalendarEvents({ search: "", eventType: "", calendarId: "primary" }),
    {
      refetchOnWindowFocus: false,
    }
  );



  const createEventMutation = useMutation(createGoogleCalendarEvent, {
    onSuccess: () => {
      queryClient.invalidateQueries("calendarEvents");
      setIsCreateDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      console.error("Error creating event:", error);
    },
  });

  const deleteEventMutation = useMutation(deleteGoogleCalendarEvent, {
    onSuccess: () => {
      queryClient.invalidateQueries("calendarEvents");
      setIsEventDialogOpen(false);
    },
    onError: (error) => {
      console.error("Error deleting event:", error);
    },
  });
  // const updateEventMutation = useMutation(updateGoogleCalendarEvent, {
  //   onSuccess: () => {
  //     queryClient.invalidateQueries("calendarEvents");
  //     setIsEventDialogOpen(false);
  //   },
  //   onError: (error) => {
  //     console.error("Error updating event:", error);
  //   },
  // });
  const resetForm = () => {
    setEventTitle("");
    setStartTime("");
    setEndTime("");
    setDescription("");
  };

  const updateDate = useCallback(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const defaultStartTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    const defaultEndTime = new Date(now.getTime() + 60 * 60 * 1000);
    const endHours = defaultEndTime.getHours();
    const endMinutes = defaultEndTime.getMinutes();
    const formattedEndTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;

    setStartTime(defaultStartTime);
    setEndTime(formattedEndTime);
  }, []);

  useEffect(() => {
    updateDate();
  }, [updateDate]);

  const handleDeleteEvent = () => {
    console.log(selectedEvent)
    if (selectedEvent && selectedEvent.id) {
      console.log("Deleting event with ID:", selectedEvent.id);
      deleteEventMutation.mutate(selectedEvent.id, {
        onSuccess: () => {
          setIsEventDialogOpen(false);
          queryClient.invalidateQueries("calendarEvents");
        },
      });
    } else {
      console.error("No event selected or event ID is missing");
    }
  };

  const handleEditEvent = () => {
    if (selectedEvent) {
      setEventTitle(selectedEvent.title);
      setSelectedDate(selectedEvent.start.toISOString().split('T')[0]);
      setStartTime(selectedEvent.start.toTimeString().slice(0, 5));
      setEndTime(selectedEvent.end.toTimeString().slice(0, 5));
      setDescription(selectedEvent.extendedProps.description || "");
      setIsEventDialogOpen(false);
      setIsCreateDialogOpen(true);
    }
  };
  const handleDateClick = (info) => {
    setSelectedEvent(null);  // Reset selectedEvent to avoid editing an event
    updateDate();  // Update default times for new event
    setSelectedDate(info.dateStr);  // Set the clicked date
    setIsCreateDialogOpen(true);  // Open create event dialog
  };
  
  
  const handleEventClick = (info) => {
    console.log(info)
    setSelectedEvent({
      id: info.event.id,
      title: info.event.title,
      start: info.event.start,
      end: info.event.end,
      extendedProps: info.event.extendedProps
    });
    setIsEventDialogOpen(true);
  };
  const formatDate = (date) => {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const handleSaveEvent = () => {
    const eventData = {
      title: eventTitle,
      start: `${selectedDate}T${startTime}:00`,
      end: `${selectedDate}T${endTime}:00`,
      description: description,
    };
  
    if (selectedEvent) {
      // Edit event logic
      eventData.id = selectedEvent.id;
      updateEventMutation.mutate(eventData);
    } else {
      // Create new event logic
      createEventMutation.mutate(eventData);
    }
  };
  
  const updateEventMutation = useMutation(updateGoogleCalendarEvent, {
    onSuccess: () => {
      queryClient.invalidateQueries("calendarEvents");
      setIsCreateDialogOpen(false);
    },
    onError: (error) => {
      console.error("Error updating event:", error);
    },
  });

  if (isLoading) return <div>Loading events...</div>;
  if (error) return <div>Error fetching events: {error.message}</div>;

  const events = data?.calendarEvents?.map((event) => ({
    title: event.summary,
    start: new Date(event.start),
    end: new Date(event.end),
    id:event.id
  })) || [];

  const handleEventDrop = (info) => {
    const updatedEvent = {
      id: info.event.id,
      title: info.event.title,
      start: info.event.start.toISOString(),
      end: info.event.end ? info.event.end.toISOString() : null,
      description: info.event.extendedProps.description || "",
    };
    updateEventMutation.mutate(updatedEvent);  // Call mutation to save changes
  };
  
  const handleEventResize = (info) => {
    const updatedEvent = {
      id: info.event.id,
      title: info.event.title,
      start: info.event.start.toISOString(),
      end: info.event.end.toISOString(),
      description: info.event.extendedProps.description || "",
    };
    updateEventMutation.mutate(updatedEvent);  // Call mutation to save changes
  };
  

  return (
    <div style={{ height: '100vh', padding: '15px' }}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        }}
        events={events}
        height="100%"
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
        editable={true}  // Enable drag-and-drop
        eventDrop={handleEventDrop}  // Handle event drag-and-drop
        eventResize={handleEventResize}  // Handle event resizing
        dateClick={handleDateClick}
        eventClick={handleEventClick}
      />

      {/* Create/Edit Event Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent ? 'Edit Event' : 'Create Event'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="eventName" className="text-right">Event Name</Label>
              <Input
                id="eventName"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="Enter event name"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="eventDate" className="text-right">Date</Label>
              <Input
                id="eventDate"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="eventStartTime" className="text-right">Start Time</Label>
              <Input
                id="eventStartTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="eventEndTime" className="text-right">End Time</Label>
              <Input
                id="eventEndTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="eventDescription" className="text-right">Description</Label>
              <Textarea
                id="eventDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter event description"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveEvent} disabled={createEventMutation.isLoading}>
              {createEventMutation.isLoading ? 'Saving...' : 'Save Event'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Event Details Dialog */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className=" flex flex-col gap-4 p-4 bg-white rounded-lg shadow-lg max-w-md">
          <div className="flex justify-end space-x-2 mb-4 gap-2 mr-7" >
            <button onClick={ handleDeleteEvent} className="text-gray-600 hover:text-red-500">
              <Trash2 className="h-5 " />
            </button>
            <button onClick={handleEditEvent} className="text-gray-600 hover:text-blue-500">
  <Pencil className="h-5 w-5" />
</button>
          </div>

          <div className="mb-2">

            <h2 className="text-xl font-semibold mb-1">{selectedEvent?.title}</h2>

            <div className="text-sm text-gray-600 mb-3">
              <p>{formatDate(selectedEvent?.start)} - {selectedEvent?.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {selectedEvent?.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>

            <div className="mb-4">
              <a href={selectedEvent?.extendedProps.meetingLink} className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                <Image src={immg} alt="Google Meet Icon" className="h-5 w-5 mr-2" />
                Join with Google Meet
              </a>
              <p className="text-sm text-gray-500 mt-2">{selectedEvent?.extendedProps.meetingLink}</p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600"><strong>Join by phone:</strong> {selectedEvent?.extendedProps.phone}</p>
          </div>

          <div className="mb-4">
            <p className="text-sm font-semibold">Guests:</p>
            <ul className="text-sm text-gray-600">
              {/* {selectedEvent?.extendedProps.guests.map((guest) => (
              <li key={guest.name} className="flex items-center">
                <span className={`mr-2 ${guest.isAttending ? 'text-green-500' : 'text-yellow-500'}`}>
                  {guest.isAttending ? '✓' : '⏳'}
                </span> 
                {guest.name}
              </li>
            ))} */}
            </ul>
          </div>

          <div className="text-sm text-gray-600">
            <p><strong>Reminder:</strong> 10 minutes before</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarComponent;