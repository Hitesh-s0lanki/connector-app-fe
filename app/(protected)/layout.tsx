"use client"
import Sidebar from "@/components/sidebar";
import { Separator } from "@/components/ui/separator";
import { QueryClient, QueryClientProvider } from 'react-query'

type Props = {
    children: React.ReactNode
};
const queryClient = new QueryClient()
const ProtectedLayout = ({
    children
}: Props) => {
    return (
        <div className=" w-full h-full flex">
            <Sidebar />
            <Separator className=" w-[2px] h-full" />
            <QueryClientProvider client={queryClient}>

            {children}
            </QueryClientProvider>
        </div>
    );
};

export default ProtectedLayout;