import { PiCheckCircleDuotone } from "react-icons/pi";

interface FormErrorProps {
    message?: string;
}

const FormSuccess: React.FC<FormErrorProps> = ({ message }) => {
    if (!message) return null;

    return (
        <div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
            <PiCheckCircleDuotone className="h-4 w-4" />
            <p>{message}</p>
        </div>
    );
};

export default FormSuccess;