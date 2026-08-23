import { Logo } from "@/components/atomsComponents";
import { SignUpForm } from "@/components/ui";
import Image from "next/image";

export default function SignUpPage() {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10 relative">
            <div className="absolute inset-0 -z-10">
                <Image
                    src="/bg.webp"
                    alt="Background pattern"
                    fill
                    className="object-cover opacity-70"
                    priority
                />
            </div>
            <div className="absolute top-0 w-full left-0 z-10 p-2 md:p-6">
                <Logo />
            </div>
            <div className="w-full max-w-sm md:max-w-3xl">
                <SignUpForm />
            </div>
        </div>
    );
}
