import { Logo } from "@/components/atomsComponents";
import { SetProfileForm } from "@/components/atomsComponents/setProfileForm";
import Image from "next/image";

export default function SetProfile() {
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

            {/* Logo */}
            <div className="absolute top-0 left-0 z-20 p-3 md:p-6 w-full">
                <Logo />
            </div>

            {/* Form Container */}
            <div className="w-full max-w-sm md:max-w-3xl z-10">
                <SetProfileForm />
            </div>
        </div>
    );
}
