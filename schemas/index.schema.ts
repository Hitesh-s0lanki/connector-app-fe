import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
})

export type loginSchemaType = z.infer<typeof loginSchema>

export const googleCredSchema = z.object({
    google_access_token: z.string(),
    google_refresh_token: z.string(),
    google_access_token_expire_in: z.string(),
})

export type googleCredSchemaType = z.infer<typeof googleCredSchema>

export const updateUserSchema = z.object({
    google_access_token: z.string().nullable(),
    google_refresh_token: z.string().nullable(),
    google_access_token_expire_in: z.string().nullable(),
})

export type updateUserSchemaType = z.infer<typeof updateUserSchema>