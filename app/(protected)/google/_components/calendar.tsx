"use client";
import React, { useState, useEffect, useCallback } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getCalendarEvents, createGoogleCalendarEvent, deleteGoogleCalendarEvent, updateGoogleCalendarEvent } from "@/actions/google.actions";
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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editEventTitle, setEditEventTitle] = useState("");
  const [editStartTime, setEditStartTime] = useState("");
  const [editEndTime, setEditEndTime] = useState("");
  const [editDescription, setEditDescription] = useState("");

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
      resetCreateForm();
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
  const resetCreateForm = () => {
    setNewEventTitle("");
    setNewStartTime("");
    setNewEndTime("");
    setNewDescription("");
  };

  const resetEditForm = () => {
    setEditEventTitle("");
    setEditStartTime("");
    setEditEndTime("");
    setEditDescription("");
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

    setNewStartTime(defaultStartTime);
    setNewEndTime(formattedEndTime);
  }, []);

  useEffect(() => {
    updateDate();
  }, [updateDate]);


  const handleDeleteEvent = () => {
    if (selectedEvent && selectedEvent.id) {
      deleteEventMutation.mutate(selectedEvent.id, {
        onSuccess: () => {
          setIsEventDialogOpen(false);
          queryClient.invalidateQueries("calendarEvents");
        },
      });
    }
  };

  const handleEditEvent = () => {
    if (selectedEvent) {
      setEditEventTitle(selectedEvent.title);
      setSelectedDate(selectedEvent.start.toISOString().split('T')[0]);
      setEditStartTime(selectedEvent.start.toTimeString().slice(0, 5));
      setEditEndTime(selectedEvent.end.toTimeString().slice(0, 5));
      setEditDescription(selectedEvent.extendedProps.description || "");
      setIsEventDialogOpen(false);
      setIsEditDialogOpen(true);
    }
  };

  const handleDateClick = (info) => {
    setSelectedEvent(null);
    updateDate();
    setSelectedDate(info.dateStr);
    setIsCreateDialogOpen(true);
    console.log(info)
  };

  const handleEventClick = (info) => {
    setSelectedEvent({
      id: info.event.id,
      title: info.event.title,
      start: info.event.start,
      end: info.event.end,
      extendedProps: info.event.extendedProps
    });
    console.log(info)
    setIsEventDialogOpen(true);
  };


  const formatDate = (date) => {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };



  const handleSaveNewEvent = () => {
    const eventData = {
      title: newEventTitle,
      start: `${selectedDate}T${newStartTime}:00`,
      end: `${selectedDate}T${newEndTime}:00`,
      description: newDescription,
    };
    createEventMutation.mutate(eventData, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        resetCreateForm();
      },
    });
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


  const handleSaveEditedEvent = () => {
    if (!selectedEvent) return;

    const originalStart = new Date(selectedEvent.start);
    const originalEnd = new Date(selectedEvent.end);

    // Create new Date objects with the edited date and time, but preserve the original time zone
    const newStart = new Date(selectedDate);
    newStart.setHours(parseInt(editStartTime.split(':')[0], 10));
    newStart.setMinutes(parseInt(editStartTime.split(':')[1], 10));
    newStart.setSeconds(0);
    newStart.setMilliseconds(0);

    const newEnd = new Date(selectedDate);
    newEnd.setHours(parseInt(editEndTime.split(':')[0], 10));
    newEnd.setMinutes(parseInt(editEndTime.split(':')[1], 10));
    newEnd.setSeconds(0);
    newEnd.setMilliseconds(0);

    // Adjust for time zone differences
    const startOffset = originalStart.getTimezoneOffset() - newStart.getTimezoneOffset();
    const endOffset = originalEnd.getTimezoneOffset() - newEnd.getTimezoneOffset();

    newStart.setMinutes(newStart.getMinutes() - startOffset);
    newEnd.setMinutes(newEnd.getMinutes() - endOffset);

    const eventData = {
      id: selectedEvent.id,
      title: editEventTitle,
      start: newStart.toISOString(),
      end: newEnd.toISOString(),
      description: editDescription,
    };

    updateEventMutation.mutate(eventData, {
      onSuccess: () => {
        setIsEditDialogOpen(false);
        resetEditForm();
      },
    });
  };


  if (isLoading) return <div>Loading events...</div>;
  if (error) return <div>Error fetching events: {error.message}</div>;

  const events = data?.calendarEvents?.map((event) => ({
    title: event.summary,
    start: new Date(event.start),
    end: new Date(event.end),
    id: event.id,
    extendedProps: {
      description: event.description,
      location: event.location,
      organizer: event.organizer,
      meetingLink: event.meetLink,
      phone: event.phoneNumber,
      attendees: event.attendees
    }
  })) || [];

  const handleEventDrop = (info) => {
    const updatedEvent = {
      id: info.event.id,
      title: info.event.title,
      start: info.event.start.toISOString(),
      end: info.event.end ? info.event.end.toISOString() : null,
      description: info.event.extendedProps.description || "",
    };
    console.log(info.event)
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
        slo tLabelFormat={{
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
            <DialogTitle>Create Event</DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="eventName" className="text-right">Event Name</Label>
              <Input
                id="newEventName"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
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
                value={newStartTime}
                onChange={(e) => setNewStartTime(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="eventEndTime" className="text-right">End Time</Label>
              <Input
                id="eventEndTime"
                type="time"
                value={newEndTime}
                onChange={(e) => setNewEndTime(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="eventDescription" className="text-right">Description</Label>
              <Textarea
                id="eventDescription"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Enter event description"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveNewEvent} disabled={createEventMutation.isLoading}>
              {createEventMutation.isLoading ? 'Saving...' : 'Save Event'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editEventName" className="text-right">Event Name</Label>
              <Input
                id="editEventName"
                value={editEventTitle}
                onChange={(e) => setEditEventTitle(e.target.value)}
                placeholder="Enter event name"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editEventDate" className="text-right">Date</Label>
              <Input
                id="editEventDate"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editEventStartTime" className="text-right">Start Time</Label>
              <Input
                id="editEventStartTime"
                type="time"
                value={editStartTime}
                onChange={(e) => setEditStartTime(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editEventEndTime" className="text-right">End Time</Label>
              <Input
                id="editEventEndTime"
                type="time"
                value={editEndTime}
                onChange={(e) => setEditEndTime(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editEventDescription" className="text-right">Description</Label>
              <Textarea
                id="editEventDescription"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Enter event description"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveEditedEvent} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Event Details Dialog */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className=" flex flex-col gap-4 p-4 bg-white rounded-lg shadow-lg max-w-md">
          <div className="flex justify-end space-x-2 mb-4 gap-2 mr-7" >
            <button onClick={handleDeleteEvent} className="text-gray-600 hover:text-red-500">
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
              <a
                href={selectedEvent?.extendedProps.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                <Image src={immg} alt="Google Meet Icon" className="h-5 w-5 mr-2" />
                Join with Google Meet
              </a>

            </div>

          </div>

          <div className="mb-4">
            <p className="text-sm font-semibold">Guests:</p>
            <ul className="text-sm text-gray-600">
              {selectedEvent?.extendedProps.attendees.map((guest) => (
              <li key={guest.name} className="flex items-center">
                <span className={`mr-2 ${guest.responseStatus=='accepted' ? 'text-green-500' : 'text-yellow-500'}`}>
                  {guest.responseStatus=='accepted' ? '✓' : '⏳'}
                </span> 
                {guest.email}
              </li>
            ))}
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