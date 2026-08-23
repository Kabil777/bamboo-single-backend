import { Logo } from "@/components/atomsComponents";
import { LoginForm } from "@/components/ui";
import Image from "next/image";

export default function LoginPage() {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="absolute inset-0 -z-10">
                <Image
                    src="/bg.webp"
                    alt="Background pattern"
                    fill
                    className="object-cover opacity-70"
                    priority
                />
            </div>
            <div className="absolute top-0 w-full left-0 z-10 p-3 md:p-6">
                <Logo />
            </div>
            <div className="w-full max-w-sm md:max-w-3xl">
                <LoginForm />
            </div>
        </div>
    );
}
