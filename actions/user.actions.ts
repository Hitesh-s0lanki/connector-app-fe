"use server";

import { currentToken } from "@/lib/auth";
import { updateUserSchema, updateUserSchemaType } from "@/schemas/index.schema";
import axios, { AxiosError } from "axios";

export const getUserData = async () => {
    try {
        const token = await currentToken()

        if (!token) {
            throw new Error("User Access token not found!");
        }

        const { data: user } = await axios.create({
            baseURL: process.env.API_URL,
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).get(`/user/data`)

        return {
            user,
            message: null
        }

    } catch (error: any) {
        if (error instanceof AxiosError) {
            if (error.response) {
                return {
                    message: (error.response?.data as any).message.toString(),
                    user: null,
                };
            }
        }
        return {
            message: error.message,
            user: null,
        };
    }
}

export const updateUser = async (
    values: updateUserSchemaType
) => {
    try {
        const validatedFields = updateUserSchema.safeParse(values);

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
        }).patch(`/user`, validatedFields.data)


        return {
            success: true,
        };
    } catch (error: any) {
        if (error instanceof AxiosError) {
            if (error.response) {
                return {
                    message: (error.response?.data as any).message.toString(),
                    success: false,
                };
            }
        }
        return {
            message: error.message,
            success: false,
        };
    }
};
