"use client";
import {
    Check,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Plus,
    Trash,
    Upload,
} from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import {
    FaDiscord,
    FaGithub,
    FaGlobe,
    FaLinkedin,
    FaTwitter,
    FaYoutube,
} from "react-icons/fa";
import { Button } from "@/components/shadcnUI/button";
import { Input } from "@/components/shadcnUI/input";
import { Label } from "@/components/shadcnUI/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/shadcnUI/select";

interface SocialLink {
    id: string;
    platform: string;
    url: string;
    icon: string;
}

interface ProfileData {
    firstName: string;
    lastName: string;
    designation: string;
    handle: string;
    description: string;
    tags: string[];
    socialLinks: SocialLink[];
    profileImage: string;
}

interface EditProfileFormProps {
    profileData?: ProfileData;
    onSave: (data: ProfileData) => void;
    onCancel?: () => void;
}

const platformIcons = {
    GITHUB: FaGithub,
    LINKEDIN: FaLinkedin,
    YOUTUBE: FaYoutube,
    TWITTER: FaTwitter,
    DISCORD: FaDiscord,
    WEBSITE: FaGlobe,
};

const socialPlatforms = [
    { value: "GITHUB", label: "Github", icon: FaGithub },
    { value: "LINKEDIN", label: "LinkedIn", icon: FaLinkedin },
    { value: "YOUTUBE", label: "YouTube", icon: FaYoutube },
    { value: "TWITTER", label: "Twitter", icon: FaTwitter },
    { value: "DISCORD", label: "Discord", icon: FaDiscord },
    { value: "WEBSITE", label: "Website", icon: FaGlobe },
];

const defaultProfileImages = [
    "https://github.com/shadcn.png",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Max",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Diana",
    "https://api.dicebear.com/7.x/bottts/svg?seed=Robot1",
    "https://api.dicebear.com/7.x/bottts/svg?seed=Robot2",
    "https://api.dicebear.com/7.x/identicon/svg?seed=Pattern1",
    "https://api.dicebear.com/7.x/identicon/svg?seed=Pattern2",
    "https://api.dicebear.com/7.x/initials/svg?seed=User",
    "https://api.dicebear.com/7.x/lorelei/svg?seed=Person1",
];

const defaultProfileData: ProfileData = {
    firstName: "",
    lastName: "",
    designation: "",
    handle: "",
    description: "",
    tags: [],
    socialLinks: [],
    profileImage: "https://github.com/shadcn.png",
};

export const EditProfileForm = ({
    profileData = defaultProfileData,
    onSave,
    onCancel,
}: EditProfileFormProps) => {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4;

    const [firstName, setFirstName] = useState(profileData.firstName);
    const [lastName, setLastName] = useState(profileData.lastName);
    const [designation, setDesignation] = useState(profileData.designation);
    const [handle, setHandle] = useState(profileData.handle);
    const [description, setDescription] = useState(profileData.description);
    const [tags, setTags] = useState<string[]>(profileData.tags);
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
        profileData.socialLinks,
    );
    const [profileImage, setProfileImage] = useState<string>(
        profileData.profileImage,
    );
    const [isLoading, setIsLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const predefinedTags = [
        "DEVELOPER",
        "DESIGNER",
        "WRITER",
        "PHOTOGRAPHER",
        "CREATOR",
        "ARTIST",
        "ENGINEER",
        "ENTREPRENEUR",
        "STUDENT",
        "TEACHER",
        "MANAGER",
        "FREELANCER",
        "PRODUCT_MANAGER",
        "DATA_SCIENTIST",
        "DEVOPS",
        "QA_ENGINEER",
        "BACKEND",
        "FRONTEND",
        "FULL_STACK",
        "MOBILE_DEV",
        "UI_UX",
        "CONTENT_CREATOR",
    ];

    const designations = [
        "DEVELOPER",
        "DESIGNER",
        "PRODUCT_MANAGER",
        "DATA_SCIENTIST",
        "DEVOPS_ENGINEER",
        "QA_ENGINEER",
        "STUDENT",
        "EDUCATOR",
        "FOUNDER",
        "ENTREPRENEUR",
        "WRITER",
        "CREATOR",
        "OTHER",
    ];

    const formatDesignation = (designation: string) => {
        return designation
            .split("_")
            .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
            .join(" ");
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file?.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file?.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const selectDefaultImage = (imageUrl: string) => {
        setProfileImage(imageUrl);
    };

    const addSocialLink = () => {
        if (socialLinks.length < 5) {
            setSocialLinks([
                ...socialLinks,
                {
                    id: Date.now().toString(),
                    platform: "GITHUB",
                    url: "",
                    icon: "GITHUB",
                },
            ]);
        }
    };

    const removeSocialLink = (id: string) => {
        setSocialLinks(socialLinks.filter((link) => link.id !== id));
    };

    const updateSocialLink = (
        id: string,
        field: "platform" | "url",
        value: string,
    ) => {
        setSocialLinks(
            socialLinks.map((link) =>
                link.id === id
                    ? {
                          ...link,
                          [field]: value,
                          ...(field === "platform" ? { icon: value } : {}),
                      }
                    : link,
            ),
        );
    };

    const handleSave = () => {
        setIsLoading(true);
        const updatedData: ProfileData = {
            firstName,
            lastName,
            designation,
            handle,
            description,
            tags: tags,
            socialLinks,
            profileImage,
        };

        // Simulate async save
        setTimeout(() => {
            onSave(updatedData);
            setIsLoading(false);
            setIsSaved(true);

            // Reset success state after showing
            setTimeout(() => {
                setIsSaved(false);
            }, 1500);
        }, 1000);
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            // Reset to original values
            setFirstName(profileData.firstName);
            setLastName(profileData.lastName);
            setDesignation(profileData.designation);
            setHandle(profileData.handle);
            setDescription(profileData.description);
            setTags(profileData.tags);

            setSocialLinks(profileData.socialLinks);
            setProfileImage(profileData.profileImage);
        }
    };

    const isFormValid = () => {
        return (
            firstName.trim() !== "" &&
            lastName.trim() !== "" &&
            designation.trim() !== "" &&
            handle.trim() !== "" &&
            tags.length > 0
        );
    };

    const canProceedToNextStep = () => {
        switch (currentStep) {
            case 1: // Profile Picture
                return true; // Optional
            case 2: // Personal Info
                return (
                    firstName.trim() !== "" &&
                    lastName.trim() !== "" &&
                    handle.trim() !== ""
                );
            case 3: // Designation & Tags
                return designation.trim() !== "" && tags.length > 0;
            case 4: // Social Links
                return true; // Optional
            default:
                return false;
        }
    };

    const handleNext = () => {
        if (canProceedToNextStep() && currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto bg-background rounded-2xl shadow-xl border p-6 md:p-8">
            {/* Step Indicator */}
            {/* <div className="mb-6 flex items-center justify-center gap-2">
				{[1, 2, 3, 4].map((step) => (
					<div key={step} className="flex items-center">
						<div
							className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors ${
								step === currentStep
									? "bg-blue-600 text-white"
									: step < currentStep
										? "bg-green-500 text-white"
										: "bg-gray-200 text-gray-600"
							}`}
						>
							{step}
						</div>
						{step < 4 && (
							<div
								className={`h-0.5 w-16 transition-colors ${
									step < currentStep ? "bg-green-500" : "bg-gray-200"
								}`}
							/>
						)}
					</div>
				))}
			</div> */}

            {/* Step Titles */}
            <div className="mb-8">
                <h2 className="text-3xl font-extrabold tracking-tight">
                    {currentStep === 1 && "Profile Picture"}
                    {currentStep === 2 && "Personal Information"}
                    {currentStep === 3 && "Designation & Interests"}
                    {currentStep === 4 && "Social Links"}
                </h2>
                <p className="text-muted-foreground mt-2.5 text-base">
                    {currentStep === 1 &&
                        "Choose or upload your profile picture"}
                    {currentStep === 2 && "Tell us about yourself"}
                    {currentStep === 3 && "Select your role and interests"}
                    {currentStep === 4 &&
                        "Connect your social profiles (optional)"}
                </p>
            </div>

            <div className="flex flex-col space-y-8 overflow-y-auto px-2 custom-scroll">
                {currentStep === 1 && (
                    <>
                        {/* Profile Image Upload */}
                        <div className="flex flex-col gap-8">
                            {/* Main Profile Image - Centered and Larger */}
                            <div className="flex flex-col items-center gap-4 pt-2">
                                <div
                                    className="relative group"
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    <div
                                        className={`w-48 h-48 rounded-3xl flex items-center justify-center overflow-hidden border-4 transition-all ${
                                            isDragging
                                                ? "border-primary border-dashed scale-105 bg-primary/10"
                                                : "border-border"
                                        }`}
                                    >
                                        {profileImage ? (
                                            <Image
                                                width={192}
                                                height={192}
                                                src={profileImage}
                                                alt="Profile"
                                                loading="eager"
                                                className={`w-full h-full object-cover transition-opacity ${isDragging ? "opacity-50" : "opacity-100"}`}
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                                                <Upload className="h-12 w-12 opacity-40" />
                                                <span className="text-sm font-medium">
                                                    {isDragging
                                                        ? "Drop image here"
                                                        : "Upload Photo"}
                                                </span>
                                            </div>
                                        )}
                                        {isDragging && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-primary/20 backdrop-blur-sm">
                                                <Upload className="h-12 w-12 text-primary animate-bounce" />
                                            </div>
                                        )}
                                    </div>
                                    <Button
                                        type="button"
                                        size="sm"
                                        className="absolute -bottom-3 -right-3 rounded-full p-3 h-12 w-12 shadow-lg hover:bg-foreground/90"
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                    >
                                        <Upload className="h-5 w-5" />
                                    </Button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                    />
                                </div>
                                <span className="text-xs text-muted-foreground font-medium text-center">
                                    Click the button or drag & drop an image
                                </span>
                            </div>

                            {/* Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-border" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">
                                        Or choose a default avatar
                                    </span>
                                </div>
                            </div>

                            {/* Default Images Grid */}
                            <div className="flex-1 w-full">
                                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 overflow-y-auto pr-2 custom-scroll p-2">
                                    {defaultProfileImages.map((img, index) => (
                                        <button
                                            key={img}
                                            type="button"
                                            className={`relative rounded-xl overflow-hidden border-2 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 aspect-square ${
                                                profileImage === img
                                                    ? "border-primary ring-2 ring-primary"
                                                    : "border-border"
                                            }`}
                                            onClick={() =>
                                                selectDefaultImage(img)
                                            }
                                            aria-label={`Select avatar ${index + 1}`}
                                        >
                                            <Image
                                                width={60}
                                                height={60}
                                                src={img}
                                                alt={`Avatar ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            {profileImage === img && (
                                                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                                    <Check className="h-6 w-6 text-primary-foreground drop-shadow-lg" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {currentStep === 2 && (
                    <>
                        {/* Personal Information */}
                        <div className="space-y-7">
                            <div className="flex gap-5">
                                <div className="grid flex-1 gap-3">
                                    <Label
                                        htmlFor="firstName"
                                        className="text-sm font-semibold"
                                    >
                                        First Name{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="firstName"
                                        value={firstName}
                                        onChange={(e) =>
                                            setFirstName(e.target.value)
                                        }
                                        className="h-11 transition-all"
                                        required
                                    />
                                </div>
                                <div className="grid flex-1 gap-3">
                                    <Label
                                        htmlFor="lastName"
                                        className="text-sm font-semibold"
                                    >
                                        Last Name{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="lastName"
                                        value={lastName}
                                        onChange={(e) =>
                                            setLastName(e.target.value)
                                        }
                                        className="h-11 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid flex-1 gap-3">
                                <Label
                                    htmlFor="handleName"
                                    className="text-sm font-semibold"
                                >
                                    Handle{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                                        @
                                    </span>
                                    <Input
                                        id="handleName"
                                        value={handle}
                                        onChange={(e) =>
                                            setHandle(e.target.value)
                                        }
                                        className="h-11 pl-8 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid flex-1 gap-3">
                                <Label
                                    htmlFor="description"
                                    className="text-sm font-semibold"
                                >
                                    Description
                                </Label>
                                <Input
                                    id="description"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    className="h-11 transition-all"
                                />
                            </div>
                        </div>
                    </>
                )}

                {currentStep === 3 && (
                    <div className="space-y-7">
                        {/* Designation Selection */}
                        <div className="space-y-4">
                            <div>
                                <Label className="text-base font-semibold">
                                    What best describes you?
                                    <span className="ml-1 text-red-500">*</span>
                                </Label>
                            </div>
                            <div className="flex flex-wrap gap-2.5">
                                {designations.map((desig) => (
                                    <button
                                        key={desig}
                                        type="button"
                                        onClick={() => setDesignation(desig)}
                                        className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border-2 ${
                                            designation === desig
                                                ? "bg-foreground text-background border-foreground shadow-md"
                                                : "bg-background text-foreground border-border hover:border-foreground/60 hover:shadow-sm"
                                        }`}
                                    >
                                        {formatDesignation(desig)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tags Selection */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <Label className="text-base font-semibold">
                                    Select your interests
                                    <span className="ml-1 text-red-500">*</span>
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Choose one or more tags that represent your
                                    skills and passions
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2.5">
                                {predefinedTags.map((tag) => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => {
                                            if (tags.includes(tag)) {
                                                setTags(
                                                    tags.filter(
                                                        (t) => t !== tag,
                                                    ),
                                                );
                                            } else {
                                                setTags([...tags, tag]);
                                            }
                                        }}
                                        className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border-2 ${
                                            tags.includes(tag)
                                                ? "bg-foreground text-background border-foreground shadow-md"
                                                : "bg-background text-foreground border-border hover:border-foreground/60 hover:shadow-sm"
                                        }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {currentStep === 4 && (
                    <>
                        {/* Social Links Section */}
                        <div className="grid gap-5 pt-2">
                            <div className="flex items-center justify-between">
                                <Label className="text-lg font-semibold">
                                    Social Links ({socialLinks.length}/5)
                                </Label>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={addSocialLink}
                                    disabled={socialLinks.length >= 5}
                                    className="h-9 px-4 transition-transform"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Link
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {socialLinks.map((link) => {
                                    const IconComponent =
                                        platformIcons[
                                            link.icon as keyof typeof platformIcons
                                        ];
                                    return (
                                        <div
                                            key={link.id}
                                            className="flex items-end gap-3 p-4 border-2 rounded-xl bg-muted/40 hover:bg-muted/60 hover:border-border/80 transition-all shadow-sm"
                                        >
                                            <div className="grid flex-1 gap-3">
                                                <Label className="text-sm font-semibold">
                                                    Platform
                                                </Label>
                                                <Select
                                                    value={link.platform}
                                                    onValueChange={(value) =>
                                                        updateSocialLink(
                                                            link.id,
                                                            "platform",
                                                            value,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger className="h-11 transition-all">
                                                        <SelectValue>
                                                            <div className="flex items-center gap-2">
                                                                {IconComponent && (
                                                                    <IconComponent className="h-4 w-4" />
                                                                )}
                                                                <span className="normal-case">
                                                                    {link.platform.charAt(
                                                                        0,
                                                                    ) +
                                                                        link.platform
                                                                            .slice(
                                                                                1,
                                                                            )
                                                                            .toLowerCase()}
                                                                </span>
                                                            </div>
                                                        </SelectValue>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {socialPlatforms.map(
                                                            (platform) => {
                                                                const Icon =
                                                                    platform.icon;
                                                                return (
                                                                    <SelectItem
                                                                        key={
                                                                            platform.value
                                                                        }
                                                                        value={
                                                                            platform.value
                                                                        }
                                                                    >
                                                                        <div className="flex items-center gap-2">
                                                                            <Icon className="h-4 w-4" />
                                                                            <span>
                                                                                {
                                                                                    platform.label
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    </SelectItem>
                                                                );
                                                            },
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid flex-[2] gap-3">
                                                <Label className="text-sm font-semibold">
                                                    URL
                                                </Label>
                                                <Input
                                                    placeholder={`https://${link.platform.toLowerCase()}.com/username`}
                                                    value={link.url}
                                                    onChange={(e) =>
                                                        updateSocialLink(
                                                            link.id,
                                                            "url",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-11 transition-all"
                                                />
                                            </div>
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="destructive"
                                                onClick={() =>
                                                    removeSocialLink(link.id)
                                                }
                                                className="h-11 px-3 transition-transform"
                                                aria-label="Remove social link"
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>

                            {socialLinks.length === 0 && (
                                <div className="text-sm text-muted-foreground text-center py-10 border-2 border-dashed rounded-xl bg-muted/20">
                                    No social links added yet. Click &quot;Add
                                    Link&quot; to add one.
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 pt-4 pb-1 border-t-2 sticky -bottom-1 bg-background">
                    {currentStep > 1 && (
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1 h-12 transition-transform font-semibold"
                            onClick={handleBack}
                        >
                            <ChevronLeft className="mr-2 h-5 w-5" />
                            Back
                        </Button>
                    )}

                    {currentStep < totalSteps ? (
                        <Button
                            type="button"
                            className="flex-1 h-12 transition-transform font-semibold shadow-sm"
                            onClick={handleNext}
                            disabled={!canProceedToNextStep()}
                        >
                            Next
                            <ChevronRight className="ml-2 h-5 w-5" />
                        </Button>
                    ) : (
                        <>
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1 h-12 transition-transform font-semibold"
                                onClick={handleCancel}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                className="flex-1 h-12 relative transition-transform font-semibold shadow-sm"
                                onClick={handleSave}
                                disabled={
                                    isLoading || isSaved || !isFormValid()
                                }
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Saving...
                                    </>
                                ) : isSaved ? (
                                    <>
                                        <Check className="mr-2 h-5 w-5" />
                                        Saved Successfully!
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
