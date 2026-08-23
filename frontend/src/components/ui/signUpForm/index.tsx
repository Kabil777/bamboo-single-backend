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
import { Card, CardContent } from "@/components/shadcnUI/card";
import { cn } from "@/lib/utils";
import { useRouter } from "nextjs-toploader/app";
import Link from "next/link";
import Image from "next/image";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});


export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();


  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });


  const onEmailSubmit = (values: z.infer<typeof emailSchema>) => {
    router.push("/setprofile");
  };

  // const onVerifySubmit = (e: React.FormEvent) => {
  //     e.preventDefault();

  //     if (otp.length !== 6) {
  //         toast.error("Enter the 6-digit verification code");
  //         return;
  //     }
  //     setStage("password");
  // };

  // const onPasswordSubmit = () => {
  //     setStage("profile");
  // };


  return (
    <div
      className={cn(
        "flex flex-col gap-6 justify-center items-center ",
        className,
      )}
      {...props}
    >
      <Card className="overflow-hidden p-0 w-full justify-center flex items-center">
        <CardContent className="p-0 w-full grid md:grid-cols-2">
          <div className="space-y-8 p-6 md:p-10 py-8 md:py-12 ">
            {/* EMAIL */}
              <>
                <Form {...emailForm}>
                  <form
                    onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                    className="space-y-6"
                  >
                    <div className="flex flex-col items-center text-center">
                      <h1 className="text-2xl font-bold">
                        Create your account
                      </h1>
                      <p className="text-balance text-muted-foreground">
                        Sign up to Bamboo account
                      </p>
                    </div>

                    <FormField
                      control={emailForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button className="w-full">Sign up</Button>
                    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                      <span className="relative z-10 bg-card px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        const authUrl = (process.env.NEXT_PUBLIC_AUTH_SERVER_URL || "http://localhost:8092").replace(/\/$/, "");
                        const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || "/api/v1";
                        window.location.href = `${authUrl}${apiVersion}/auth/login/google`;
                      }}
                    >
                      <FcGoogle />
                      <span className="ml-2">Continue with Google</span>
                    </Button>
                  </form>
                </Form>
                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link href="/login" className="underline underline-offset-4">
                    Log in
                  </Link>
                </div>
              </>

            {/* VERIFY */}
            {/* {stage === "verify" && (
                            <form onSubmit={onVerifySubmit} className="space-y-6 text-center">
                                <h1 className="text-2xl font-bold">Verify Email</h1>
                                <p className="text-muted-foreground">{email}</p>

                                <div className="flex justify-center w-full">
                                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                                        <InputOTPGroup>
                                            {[...Array(6)].map((_, i) => (
                                                <InputOTPSlot key={i} index={i} />
                                            ))}
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>

                                <Button className="w-full">Verify</Button>
                                <Button variant="ghost" className="w-full" onClick={() => setStage("email")}>
                                    Back
                                </Button>
                            </form>
                        )} */}

            {/* PASSWORD */}
            {/* {stage === "password" && (
                            <Form {...passwordForm}>
                                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                                    <h1 className="text-2xl font-bold text-center">Set Password</h1>

                                    <FormField
                                        control={passwordForm.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" value={field.value} onChange={field.onChange} onBlur={field.onBlur} name={field.name} ref={field.ref} autoComplete="new-password" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={passwordForm.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" value={field.value} onChange={field.onChange} onBlur={field.onBlur} name={field.name} ref={field.ref} autoComplete="new-password" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button className="w-full">Continue</Button>
                                </form>
                            </Form>
                        )} */}
          </div>

          <div className="relative hidden md:block">
            <Image
              fill
              src="https://modii.org/wp-content/uploads/2020/12/random.png"
              alt=""
              className="object-cover dark:brightness-75"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
