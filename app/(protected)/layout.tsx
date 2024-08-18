import Sidebar from "@/components/sidebar";
import { Separator } from "@/components/ui/separator";

type Props = {
    children: React.ReactNode
};

const ProtectedLayout = ({
    children
}: Props) => {
    return (
        <div className=" w-full h-full flex">
            <Sidebar />
            <Separator className=" w-[2px] h-full" />
            {children}
        </div>
    );
};

export default ProtectedLayout;