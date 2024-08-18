"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const ErrorPage = ({ title }: { title: string }) => {
    const router = useRouter();
    return (
        <div className="h-full w-full flex  justify-center items-center">
            <div className="text-center">
                <Image
                    src="/error.webp"
                    alt="Error Image"
                    className="mx-auto mb-4"
                    width={500}
                    height={500}
                />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Oops! Page not found.
                </h1>
                <h1 className="text-xl font-bold text-gray-900 mb-2">{title}</h1>
                <p className="text-gray-600 mb-4">
                    {"We can't find the page you're looking for."}
                </p>
                <Button variant="link" onClick={() => router.replace("/")}>
                    Go Back to home
                </Button>
            </div>
        </div>
    );
};

export default ErrorPage;