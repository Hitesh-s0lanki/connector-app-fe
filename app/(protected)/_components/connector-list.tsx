"use client";

import { useState } from "react";
import ConnectorCard from "./connector-card";
import { User } from "@/types/index.types";
import { updateUser } from "@/actions/user.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = {
    user: User
}

const ConnectorList = ({ user }: Props) => {

    const router = useRouter()

    const [google, setGoogle] = useState(user.google_access_token ? true : false)
    const [linkedin, setLinkedin] = useState(false)

    const handleGoogle = (value: boolean) => {
        if (!google) {
            window.location.href = "/api/auth/google";
        } else {
            updateUser({
                google_access_token: null,
                google_refresh_token: null,
                google_access_token_expire_in: null
            }).then((res) => {
                if (res.success) {
                    toast.success("Updated Google Successfully");
                    setGoogle(false)
                    router.refresh();
                } else {
                    toast.error(res.message);
                }
            })
                .catch((error) => toast.error(error.message));
        }
    }

    const handleLinkedin = (value: boolean) => {
        setLinkedin(value)
        if (!linkedin) {
            window.location.href = "/api/auth/linkedin";
        }
    }

    return (
        <div className=" h-full w-full  flex flex-col gap-5 p-10">
            <h1 className=" font-semibold text-xl">Connector</h1>
            <ConnectorCard
                title="Google"
                description="connect to google inbox, calender and more."
                value={google}
                onChange={handleGoogle}
            />
            <ConnectorCard
                title="Linkedin"
                description="connect to linkedin to access posts and jobs."
                value={linkedin}
                onChange={handleLinkedin}
            />
            {/* <ConnectorCard />
      <ConnectorCard /> */}
        </div>
    )
}

export default ConnectorList