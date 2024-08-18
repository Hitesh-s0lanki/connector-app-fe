"use client";

import { useGetInbox } from "@/actions/features/google.feature";
import { Input } from "@/components/ui/input";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Search } from "lucide-react";
import MailBox from "./mail-box";

const Mail = () => {

    const inboxQuery = useGetInbox();

    if (inboxQuery.isError) {
        return <div>Error: {inboxQuery.error.message}</div>;
    }

    return (
        <div className=" h-full w-full grid grid-cols-2 border-r-2">
            <div className=" h-full w-full flex flex-col gap-5 border-r-2">
                <Tabs defaultValue="all" className=" h-full">
                    <div className="flex justify-between border-t-2 border-b-2 p-5">
                        <h1 className=" font-semibold text-xl ">Inbox</h1>

                        <TabsList className="ml-auto">
                            <TabsTrigger
                                value="all"
                                className="text-zinc-600 dark:text-zinc-200"
                            >
                                All mail
                            </TabsTrigger>
                            <TabsTrigger
                                value="unread"
                                className="text-zinc-600 dark:text-zinc-200"
                            >
                                Unread
                            </TabsTrigger>
                        </TabsList>

                    </div>
                    <div className=" flex-1 flex flex-col gap-2 h-full p-4">
                        <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-1">
                            <form>
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Search" className="pl-8" />
                                </div>
                            </form>
                        </div>
                        <TabsContent value="all" className="m-0 flex-1 max-h-full overflow-auto">
                            {inboxQuery.isLoading ? (
                                <div>
                                    Loading...
                                </div>
                            ) : (<div className="h-full overflow-auto flex flex-col gap-2">
                                {!inboxQuery.data?.message && inboxQuery.data?.inbox?.map((mail) => (
                                    <MailBox
                                        inbox={mail}
                                    />
                                ))}
                            </div>)}
                        </TabsContent>
                        <TabsContent value="unread" className="m-0">
                            {/* <MailList items={mails.filter((item) => !item.read)} /> */}
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
};

export default Mail;