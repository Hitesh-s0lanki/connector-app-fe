"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormError from "./_components/form-error";
import FormSuccess from "./_components/form-success";
import { useState } from "react";
import { login } from "@/lib/login";
import { loginSchema, loginSchemaType } from "@/schemas/index.schema";

const LoginForm = () => {

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<loginSchemaType>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = (values: loginSchemaType) => {
        setIsLoading(true)

        login(values)
            .then((data) => {
                if (data?.success) {
                    form.reset();
                    setSuccess(data?.success);
                }

                if (data?.error) {
                    setError(data.error);
                    setIsLoading(false)
                }
            })
            .catch((error) => {
                setError(error.message);
                setIsLoading(false)
            })
    }

    return (
        <div className=" h-full w-full flex justify-center items-center">
            <Card className="w-1/3">
                <CardHeader>
                    <CardTitle className=" text-xl">Login Form</CardTitle>
                    <CardDescription>Welcome back.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="hiteshsolanki4623@gmail.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input placeholder="***********" {...field}
                                                type="password"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormError message={error} />
                            <FormSuccess message={success} />
                            <div className="w-full">
                                <Button type="submit" className="w-full"
                                    disabled={isLoading}
                                >Submit</Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginForm;