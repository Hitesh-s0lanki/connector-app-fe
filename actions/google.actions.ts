"use server";

import { currentToken } from "@/lib/auth";
import { googleCredSchema, googleCredSchemaType } from "@/schemas/index.schema";
import axios, { AxiosError } from "axios";
import { Inbox, DriveFile,CalendarEvent } from "@/types/index.types";

export const googleCred = async (values: googleCredSchemaType) => {
    try {
        const validatedFields = googleCredSchema.safeParse(values);

        if (!validatedFields.success) throw new Error("Ivalid fields!");

        const token = await currentToken()

        if (!token) {
            throw new Error("User Access token not found!");
        }

        await axios.create({
            baseURL: process.env.API_URL,
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).post(`/user/google`, validatedFields.data)

    } catch (error: any) {
        console.log(error)
        // throw error
    }
}

export const getInbox = async () => {
    try {
        const token = await currentToken()

        if (!token) {
            throw new Error("User Access token not found!");
        }

        const { data: inbox } = await axios.create({
            baseURL: process.env.API_URL,
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).get(`/google/inbox`)

        return {
            inbox: inbox as Inbox[],
            message: null
        }
    } catch (error: any) {
        if (error instanceof AxiosError) {
            if (error.response) {
                return {
                    message: (error.response?.data as any).message.toString(),
                    inbox: null,
                };
            }
        }
        return {
            inbox: null,
            message: error.message
        }
    }

    


}
export const getFolderDetails = async (folderId: string) => {
  try {
    const token = await currentToken();

    if (!token) {
      throw new Error("User Access token not found!");
    }

    const { data: folderDetails } = await axios.create({
      baseURL: process.env.API_URL,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).get(`/google/folder/${folderId}`);

    return {
      folderDetails: folderDetails,
      message: null
    };
  } catch (error: any) {
    if (error instanceof AxiosError) {
      if (error.response) {
        return {
          message: (error.response?.data as any).message.toString(),
          folderDetails: null,
        };
      }
    }
    return {
      folderDetails: null,
      message: error.message
    }
  }
}
// export const getDriveFiles = async () => {
//     try {
//         const token = await currentToken();

//         if (!token) {
//             throw new Error("User Access token not found!");
//         }

//         const { data: driveFiles } = await axios.create({
//             baseURL: process.env.API_URL,
//             headers: {
//                 Authorization: `Bearer ${token}`
//             }
//         }).get(`/google/files`);

//         return {
//             driveFiles: driveFiles as DriveFile[],
//             message: null
//         };
//     } catch (error: any) {
//         if (error instanceof AxiosError) {
//             if (error.response) {
//                 return {
//                     message: (error.response?.data as any).message.toString(),
//                     driveFiles: null,
//                 };
//             }
//         }
//         return {
//             driveFiles: null,
//             message: error.message
//         }
//     }
// }

export const getDriveFiles = async (query: { search?: string, fileType?: string, folderId?: string }) => {
  try {
    const token = await currentToken();

    if (!token) {
      throw new Error("User Access token not found!");
    }

    const { data: driveFiles } = await axios.create({
      baseURL: process.env.API_URL,
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: query,
    }).get(`/google/files`);

    return {
      driveFiles: driveFiles as DriveFile[],
      message: null
    };
  } catch (error: any) {
    if (error instanceof AxiosError) {
      if (error.response) {
        return {
          message: (error.response?.data as any).message.toString(),
          driveFiles: null,
        };
      }
    }
    return {
      driveFiles: null,
      message: error.message
    }
  }
}

  export const getCalendarEvents = async (query: { search?: string, eventType?: string, calendarId?: string }) => {
    try {
      const token = await currentToken();
  
      if (!token) {
        throw new Error("User Access token not found!");
      }
  
      const { data: calendarEvents } = await axios.create({
        baseURL: process.env.API_URL,
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: query,
      }
    
    ).get(`/google/calendar`);
      // console.log(calendarEvents)
  
      return {
        calendarEvents: calendarEvents as CalendarEvent[],
        message: null
      };
    } catch (error: any) {
      if (error instanceof AxiosError) {
        if (error.response) {
          return {
            message: (error.response?.data as any).message.toString(),
            calendarEvents: null,
          };
        }
      }
      return {
        calendarEvents: null,
        message: error.message
      };
    }
  };

  export const createGoogleCalendarEvent = async (eventData: any) => {
    try {
      const token = await currentToken();
  
      if (!token) {
        throw new Error("User Access token not found!");
      }
  
      const { data: createdEvent } = await axios.create({
        baseURL: process.env.API_URL,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).post(`/google/event`, eventData);
      console.log(createdEvent)
      return {
        createdEvent,
        message: null,
      };
    } catch (error: any) {
      if (error instanceof AxiosError) {
        if (error.response) {
          return {
            message: (error.response?.data as any).message.toString(),
            createdEvent: null,
          };
        }
      }
  
      return {
        createdEvent: null,
        message: error.message,
      };
    }
  };

  export const deleteGoogleCalendarEvent = async (id:any) =>{
    try {
      const token = await currentToken();
  
      if (!token) {
        throw new Error("User Access token not found!");
      }
  
      const { data: deletedEvent } = await axios.create({
        baseURL: process.env.API_URL,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).delete(`/google/event/delete/${id}`);
      console.log(deletedEvent)
      return {
        deletedEvent,
        message: null,
      };
    } catch (error: any) {
      if (error instanceof AxiosError) {
        if (error.response) {
          return {
            message: (error.response?.data as any).message.toString(),
            deletedEvent: null,
          };
        }
      }
  
      return {
        deletedEvent: null,
        message: error.message,
      };
    }
  }

  export const updateGoogleCalendarEvent = async (eventData: any) => {
    try {
      const token = await currentToken();
  
      if (!token) {
        throw new Error("User Access token not found!");
      }
  
      const { data: updatedEvent } = await axios.create({
        baseURL: process.env.API_URL,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).patch(`/google/event/update/${eventData.id}`, eventData);
  
      return {
        updatedEvent,
        message: null,
      };
    } catch (error: any) {
      if (error instanceof AxiosError) {
        if (error.response) {
          return {
            message: (error.response?.data as any).message.toString(),
            updatedEvent: null,
          };
        }
      }
  
      return {
        updatedEvent: null,
        message: error.message,
      };
    }
  };
  // export const getCalendarEvents = async (query: { search?: string, eventType?: string, calendarId?: string }) => {
  //   const token = await currentToken();
  
  //   if (!token) {
  //     throw new Error("User Access token not found!");
  //   }
  
  //   const { data: calendarEvents } = await axios.get(`${process.env.API_URL}/google/calendar`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`
  //     },
  //     params: query,
  //   });
  
  //   return calendarEvents;
  // };