"use client";

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

type Props = {
    title: string;
    description: string;
    value: boolean;
    onChange: (value: boolean) => void
};

const ConnectorCard = ({
    title,
    description,
    value,
    onChange }: Props) => {
    return (
        <Card>
            <CardHeader className=" flex flex-row justify-between items-center">
                <div className=" flex flex-col gap-2">
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
                <Switch
                    checked={value}
                    onCheckedChange={onChange}
                />
            </CardHeader>
        </Card>

    );
};

export default ConnectorCard;