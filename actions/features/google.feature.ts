import { currentToken } from "@/lib/auth";
import { Inbox } from "@/types/index.types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getInbox, getDriveFiles } from "../google.actions";

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


export const useGetDriveFiles = (searchQuery: string = "", fileType?: string) => {
  return useQuery({
    queryKey: ["driveFiles", searchQuery, fileType],
    queryFn: async () => {
      const data = await getDriveFiles({ search: searchQuery, fileType });
      return data;
    },
    keepPreviousData: true,
  });
};
