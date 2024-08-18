import MailSideBar from "./_components/mail-sidebar";

type Props = {
    children: React.ReactNode
};

const GoogleLayout = ({
    children
}: Props) => {
    return (
        <div className=" flex h-full w-full">
            <MailSideBar isCollapsed={false} />
            {children}
        </div>
    );
};

export default GoogleLayout;