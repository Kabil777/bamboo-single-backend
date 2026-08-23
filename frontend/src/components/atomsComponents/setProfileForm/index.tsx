"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import { useTagCatalog } from "@/hooks/useTagCatalog";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { z } from "zod";
import { Button } from "@/components/shadcnUI/button";
import { Card, CardContent } from "@/components/shadcnUI/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/shadcnUI/form";
import { useAppState } from "@/hooks/ReduxHooks";
import { cn } from "@/lib/utils";
import {
	setAllProfile,
	setProfileApi,
} from "@/store/reducers/Profile/profile.edit";

const DESIGNATIONS = [
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
] as const;

const TAGS = [
	"Developer",
	"Designer",
	"Writer",
	"Photographer",
	"Creator",
	"Artist",
	"Engineer",
	"Entrepreneur",
	"Student",
	"Teacher",
	"Manager",
	"Freelancer",
	"Product Manager",
	"Data Scientist",
	"DevOps",
	"QA Engineer",
	"Backend",
	"Frontend",
	"Full Stack",
	"Mobile Dev",
	"UI/UX",
	"Content Creator",
] as const;

const profileSchema = z.object({
	designation: z.string().min(1, "Please select a designation"),
	tags: z.array(z.string()).min(1, "Please select at least one tag"),
});

const formatDesignation = (designation: string) => {
	return designation
		.split("_")
		.map((word) => word.charAt(0) + word.slice(1).toLowerCase())
		.join(" ");
};

export const SetProfileForm = ({
	className,
	...props
}: React.ComponentProps<"div">) => {
	const router = useRouter();
	const dispatch = useDispatch<any>();
	const profileState = useAppState((s) => s.setProfileReducers);
	const { designations, interests } = useTagCatalog();

	const [selectedDesignation, setSelectedDesignation] = useState<string>("");
	const [selectedTags, setSelectedTags] = useState<string[]>([]);

	const profileForm = useForm<z.infer<typeof profileSchema>>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			designation: "",
			tags: [],
		},
	});

	const toggleDesignation = (designation: string) => {
		setSelectedDesignation(designation);
		profileForm.setValue("designation", designation, {
			shouldValidate: true,
		});
	};

	const toggleTag = (tag: string) => {
		const newTags = selectedTags.includes(tag)
			? selectedTags.filter((t) => t !== tag)
			: [...selectedTags, tag];

		setSelectedTags(newTags);
		profileForm.setValue("tags", newTags, { shouldValidate: true });
	};

	const onProfileSubmit = async (values: z.infer<typeof profileSchema>) => {
		const payload = {
			designation: values.designation,
			userProfile: {
				tags: values.tags,
				social: {},
			},
		};

		dispatch(setAllProfile(payload));
		dispatch(setProfileApi(payload));

		// Redirect after successful submission
		setTimeout(() => router.push("/"), 1000);
	};

	return (
		<div
			className={cn(
				"flex min-h-screen w-full items-center justify-center p-4",
				className,
			)}
			{...props}
		>
			<Card className="w-full max-w-2xl overflow-hidden">
				<CardContent className="p-0">
					<div className="space-y-6 p-8 md:p-12">
						{/* Header */}
						<div className="space-y-2 text-center">
							<h1 className="text-3xl font-bold tracking-tight">
								Complete Your Profile
							</h1>
							<p className="text-muted-foreground">
								Help us personalize your experience by selecting your role and
								interests
							</p>
						</div>

						{/* Form */}
						<Form {...profileForm}>
							<div className="space-y-8">
								{/* Designation Selection */}
								<FormField
									control={profileForm.control}
									name="designation"
									render={({ field }) => (
										<FormItem className="space-y-4">
											<FormLabel className="text-base font-semibold">
												What best describes you?
												<span className="ml-1 text-red-500">*</span>
											</FormLabel>
											<FormControl>
												<div className="flex flex-wrap gap-2">
													{designations.map((designation) => (
														<button
															key={designation}
															type="button"
															onClick={() => toggleDesignation(designation)}
															className={cn(
																"px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border-2",
																selectedDesignation === designation
																	? "bg-foreground text-background border-foreground shadow-sm"
																	: "bg-background text-foreground border-border hover:border-foreground/50 hover:shadow-sm",
															)}
														>
															{formatDesignation(designation)}
														</button>
													))}
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* Tags Selection */}
								<FormField
									control={profileForm.control}
									name="tags"
									render={({ field }) => (
										<FormItem className="space-y-4">
											<div className="space-y-1">
												<FormLabel className="text-base font-semibold">
													Select your interests
													<span className="ml-1 text-red-500">*</span>
												</FormLabel>
												<p className="text-sm text-muted-foreground">
													Choose one or more tags that represent your skills and
													passions
												</p>
											</div>
											<FormControl>
												<div className="flex flex-wrap gap-2">
													{interests.map((tag) => (
														<button
															key={tag}
															type="button"
															onClick={() => toggleTag(tag)}
															className={cn(
																"px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border-2",
																selectedTags.includes(tag)
																	? "bg-foreground text-background border-foreground shadow-sm"
																	: "bg-background text-foreground border-border hover:border-foreground/50 hover:shadow-sm",
															)}
														>
															{tag}
														</button>
													))}
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* Submit Button */}
								<Button
									className="w-full h-11 text-base font-medium"
									onClick={profileForm.handleSubmit(onProfileSubmit)}
								>
									Complete Profile
								</Button>
							</div>
						</Form>
					</div>
				</CardContent>
			</Card>

			{/* Footer */}
			<div className="fixed bottom-4 left-0 right-0 text-center">
				<p className="text-xs text-muted-foreground">
					By continuing, you agree to our{" "}
					<a
						href="#"
						className="underline underline-offset-4 hover:text-primary transition-colors"
					>
						Terms of Service
					</a>{" "}
					and{" "}
					<a
						href="#"
						className="underline underline-offset-4 hover:text-primary transition-colors"
					>
						Privacy Policy
					</a>
				</p>
			</div>
		</div>
	);
};
