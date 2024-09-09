"use client";

import { cn } from "@/lib/utils";
import { Raleway } from "next/font/google";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { GoalIcon, Link2,File,Linkedin , Calendar} from "lucide-react";

type Props = {};

const font = Raleway({
    weight: "600",
    subsets: ["latin"],
});

const routes = [
    {
        label: "Connector",
        icon: Link2,
        href: "/",
        color: "text-[#005EE9]",
    },
    {
        label: "Google",
        icon: GoalIcon,
        href: "/google",
        color: "text-[#005EE9]",
    },
    {
        label: "Linkedin",
        icon: Linkedin,
        href: "/linkedin",
        color: "text-[#005EE9]",
    },
    {
        label: "Drive",
        icon: File,
        href: "/google/drive",
        color: "text-[#005EE9]",
    },
    {
        label: "Calendar",
        icon: Calendar,
        href: "/google/calendar",
        color: "text-[#005EE9]",
    },
];

const Sidebar = ({ }: Props) => {
    const pathname = usePathname();

    return (
        <div className="hidden space-y-4 p-4 w-60 md:flex md:flex-col lg:flex lg:flex-col h-full justify-between ">
            <div className="px-1 py-2 flex-1">
                <Link href="/" className="flex items-center  mb-5">
                    <h1 className={cn("text-2xl font-bold text-center", font.className)}>Connector app</h1>
                </Link>
                <div className="space-y-2 w-full">
                    {routes.map((route) => (
                        <Button
                            key={route.href}
                            className={cn(
                                "w-full flex justify-start items-center border-none bg-transparent",
                                pathname === route.href && "border-2 bg-[#E0F0FF]",
                                pathname === route.href && "hover:bg-[#E0F0FF]"
                            )}
                            variant="outline"
                            size="sm"
                            asChild
                        >
                            <Link href={route.href}>
                                <route.icon className={cn("h-5 w-5 mr-2", route.color)} />
                                {route.label}
                            </Link>
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;