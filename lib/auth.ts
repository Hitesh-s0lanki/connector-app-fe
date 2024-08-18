import { auth } from "@/auth";

export const currentUser = async () => {
    const session = await auth();

    return session?.user;
};

export const currentToken = async () => {
    const session = await auth();

    return session?.access_token;
};