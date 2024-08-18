import { currentToken } from "@/lib/auth";
import { Inbox } from "@/types/index.types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getInbox } from "../google.actions";

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