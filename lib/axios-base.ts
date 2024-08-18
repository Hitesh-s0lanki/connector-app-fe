"use server"

import axios from "axios";
import { currentToken } from "./auth"

export const axiosBase = () => {
    try {
        const token = currentToken()

        if (!token) {
            throw new Error("User Access token not found!");
        }

        return axios.create({
            baseURL: process.env.API_URL,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

    } catch (error: any) {
        throw error
    }
}