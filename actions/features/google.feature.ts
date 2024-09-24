import { currentToken } from "@/lib/auth";
import { Inbox } from "@/types/index.types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getInbox, getDriveFiles,getCalendarEvents , createGoogleCalendarEvent ,deleteGoogleCalendarEvent} from "../google.actions";
import { AxiosError } from "axios";

export const useGetInbox = () => {
    const query = useQuery({
        queryKey: ["inbox"],
        queryFn: async () => {
            const data = await getInbox()
            return data
        }
    })

    return query
}


export const useGetDriveFiles = (searchQuery: string = "", fileType?: string, folderId?: string) => {
  return useQuery({
    queryKey: ["driveFiles", searchQuery, fileType, folderId],
    queryFn: async () => {
      const data = await getDriveFiles({ search: searchQuery, fileType, folderId });
      console.log("The returned Data: ", data);
      return data;
    },
    keepPreviousData: true,
  });
};
// export const useGetCalendarEvents = (searchQuery: string = "", eventType?: string, calendarId?: string) => {
//   return useQuery({
//     queryKey: ["calendarEvents", searchQuery, eventType, calendarId],
//     queryFn: async () => {
//       const data = await getCalendarEvents({ search: searchQuery, eventType, calendarId });
//       console.log("The returned Data: ", data);
//       return data;
//     },
//     keepPreviousData: true,
//   });
// };

// google.feature.ts

export const useGetFolderDetails = (folderId: string) => {
  return useQuery({
    queryKey: ["folderDetails", folderId],
    queryFn: async () => {
      const data = await getFolderDetails(folderId);
      console.log("Folder details:", data);
      return data.folderDetails;
    },
    enabled: !!folderId,
  });
};

export const useGetCalendarEvents = (searchQuery: string = "", eventType?: string, calendarId?: string) => {
  return useQuery({
    queryKey: ["calendarEvents", searchQuery, eventType, calendarId],
    queryFn: async () => {
      const data = await getCalendarEvents({ search: searchQuery, eventType, calendarId });
      // console.log("this is from features ",{data})
      return data;
    },
    keepPreviousData: true,
  });
};


export const usecreateGoogleCalendarEvent = (eventData: any) => {
  return useQuery({
    queryKey: ["createEvent", eventData],
    queryFn: async () => {
      const data = await createGoogleCalendarEvent(eventData);
      return data;
    },
  });
}

export const useDeleteEvent = (id:any) =>{
  return useQuery({
    queryKey: ["deleteEvent"],
    queryFn: async () => {
      const data = await deleteGoogleCalendarEvent(id);
      return data;
    },
  });
}

