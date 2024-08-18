import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Inbox } from "@/types/index.types";

type Props = {
    inbox: Inbox
};

const MailBox = ({ inbox }: Props) => {
    return (
        <Card>
            <CardHeader className=" p-2">
                <CardTitle className=" text-lg font-semibold">{inbox.name}</CardTitle>
                <CardDescription>{inbox.subject}</CardDescription>
            </CardHeader>
            <CardContent className=" p-2 text-sm">
                {inbox.snippet}
            </CardContent>
        </Card>
    );
};

export default MailBox;