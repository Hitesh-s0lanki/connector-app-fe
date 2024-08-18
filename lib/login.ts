"use server";

import { loginSchema, loginSchemaType } from "@/schemas/index.schema";
import { axiosBase } from "./utils";
import { signIn } from "@/auth";

export async function login(values: loginSchemaType) {
    try {
        const validatedFields = loginSchema.safeParse(values)

        if (!validatedFields.success) throw new Error("Ivalid fields!")

        const {
            data: user
        } = await axiosBase.post('/user/login', validatedFields.data)

        if (user) {
            const redirectTo = "/"

            await signIn("credentials", {
                email: values.email,
                password: values.password,
                redirectTo,
            })

            return {
                success: "Login Successfull"
            }
        }

        return {
            error: "user Not Found!"
        }

    } catch (error) {
        throw error
    }
}