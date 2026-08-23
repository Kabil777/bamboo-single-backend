"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/shadcnUI/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/shadcnUI/form";
import { Input } from "@/components/shadcnUI/input";
import Image from "next/image";
import { Card, CardContent } from "@/components/shadcnUI/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "nextjs-toploader/app";
import { useAppDispatch } from "@/hooks/ReduxHooks";
import { getAuthentication } from "@/store/reducers/AuthReducers";
import Link from "next/link";

const formSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .refine((value) => /[a-z]/.test(value), {
            message: "Password must contain at least one lowercase letter",
        })
        .refine((value) => /[A-Z]/.test(value), {
            message: "Password must contain at least one uppercase letter",
        })
        .refine((value) => /\d/.test(value), {
            message: "Password must contain at least one number",
        })
        .refine((value) => /[^a-zA-Z0-9]/.test(value), {
            message: "Password must contain at least one special character",
        }),
});

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    async function onSubmit() {
        const res = await dispatch(getAuthentication()).unwrap();
        toast.success(`Login successful as ${res.data.email}`);
        router.push("/");
    }

    return (
        <>
            <div className={cn("flex flex-col gap-6", className)} {...props}>
                <Card className="overflow-hidden p-0">
                    <CardContent className="grid p-0 md:grid-cols-2">
                        <div className="space-y-8 p-6 md:p-8">
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-8"
                                >
                                    <div className="flex flex-col items-center text-center">
                                        <h1 className="text-2xl font-bold">
                                            Welcome
                                        </h1>
                                        <p className="text-balance text-muted-foreground">
                                            Login to your Bamboo account
                                        </p>
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Email"
                                                        {...field}
                                                    />
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
                                                    <Input
                                                        type="password"
                                                        placeholder="Password"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                                <a
                                                    href="#"
                                                    className="ml-auto text-xs underline-offset-2 hover:underline"
                                                >
                                                    Forgot your password?
                                                </a>
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full">
                                        Login
                                    </Button>
                                </form>
                            </Form>
                            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                <span className="relative z-10 bg-card px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                    router.push(
                                        `${process.env.NEXT_PUBLIC_AUTH_SERVER_URL}${process.env.NEXT_PUBLIC_API_VERSION}/auth/login/google?mode=signup`,
                                    );
                                }}
                            >
                                <FcGoogle />
                                <span>Login with Google</span>
                            </Button>
                            <div className="text-center text-sm">
                                Don&apos;t have an account?{" "}
                                <Link
                                    href="/signup"
                                    className="underline underline-offset-4"
                                >
                                    Sign up
                                </Link>
                            </div>
                        </div>
                        <div className="relative hidden bg-muted md:block">
                            <Image
                                width={500}
                                height={500}
                                src="https://simpleprogrammer.com/wp-content/uploads/2017/07/Blogging-for-Software-Developers.png"
                                alt=""
                                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                            />
                        </div>
                    </CardContent>
                </Card>
                <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
                    <a href="#">Terms of Service</a> and{" "}
                    <a href="#">Privacy Policy</a>.
                </div>
            </div>
        </>
    );
}
