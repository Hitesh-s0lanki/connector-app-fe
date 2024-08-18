"use server"

import { axiosBase } from "@/lib/utils"
import { loginSchema, loginSchemaType } from "@/schemas/index.schema"

export const login = async (values: loginSchemaType) => {
    try {
        const validatedFields = loginSchema.safeParse(values);

        if (!validatedFields.success) throw new Error("Ivalid fields!");

        const { data: user } = await axiosBase.post(`/user/login`, validatedFields.data)

        if (!user) {
            return null
        }

        return user

    } catch (error) {
        return null
    }
}

export const GetUserById = async (id: string) => {
    try {
        if (!id) return null

        const { data: user } = await axiosBase.get(`/user/${id}`)

        return user

    } catch (error) {
        return null
    }
}
