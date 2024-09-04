"use server";

import { currentToken } from "@/lib/auth";
import { googleCredSchema, googleCredSchemaType } from "@/schemas/index.schema";
import axios, { AxiosError } from "axios";
import { Inbox, DriveFile } from "@/types/index.types";

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

export const getDriveFiles = async (query: { search?: string, fileType?: string }) => {
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