"use client"

import Link from "next/link"
import { Calendar, File, Inbox, LucideIcon, MessageSquareTextIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { usePathname } from "next/navigation"

type Props = {
    isCollapsed: boolean
};

const links = [
    {
        title: "Mails",
        label: "128",
        icon: Inbox,
        href: "/google"
    },
    {
        title: "Calendar",
        icon: Calendar,
        href: "/google/calendar"
    },
  
    {
        title: "Meetings",
        icon: MessageSquareTextIcon,
        href: "/google/meetings"
    },
]

const MailSideBar = ({
    isCollapsed
}: Props) => {

    const pathname = usePathname()

    return (
        <div
            className={cn(
                " h-full flex space-y-4 p-4 w-60 justify-center border-r-2",
            )}
        >
            <div
                className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2 w-full"
            >
                <nav className="grid gap-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
                    {links.map((link, index) =>
                    (
                        <Link
                            key={index}
                            href={link.href}
                            className={cn(
                                buttonVariants({ variant: pathname === link.href ? "default" : "ghost", size: "sm" }),
                                pathname === link.href &&
                                "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                                "justify-start"
                            )}
                        >
                            <link.icon className="mr-2 h-4 w-4" />
                            {link.title}
                            {link.label && (
                                <span
                                    className={cn(
                                        "ml-auto",
                                        pathname === link.href &&
                                        "text-background dark:text-white"
                                    )}
                                >
                                    {link.label}
                                </span>
                            )}
                        </Link>
                    )
                    )}
                </nav>
            </div>
        </div>
    );
};

export default MailSideBar;