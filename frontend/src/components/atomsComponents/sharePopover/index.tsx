"use client";
import { Check, Copy } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import {
	FaFacebook,
	FaLinkedin,
	FaReddit,
	FaTelegram,
	FaTwitter,
	FaWhatsapp,
} from "react-icons/fa";
import { Button } from "@/components/shadcnUI/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/shadcnUI/dialog";
import { Input } from "@/components/shadcnUI/input";
import { Label } from "@/components/shadcnUI/label";

interface SharePopoverProps {
	text: string;
	children: ReactNode;
	open?: boolean;
	setOpen?: (open: boolean) => void;
}

const socialPlatforms = [
	{ platform: "facebook", label: "Facebook", icon: FaFacebook },
	{ platform: "twitter", label: "Twitter", icon: FaTwitter },
	{ platform: "linkedin", label: "LinkedIn", icon: FaLinkedin },
	{ platform: "whatsapp", label: "WhatsApp", icon: FaWhatsapp },
	{ platform: "telegram", label: "Telegram", icon: FaTelegram },
	{ platform: "reddit", label: "Reddit", icon: FaReddit },
];

export const SharePopover = ({
	text,
	children,
	open,
	setOpen,
}: SharePopoverProps) => {
	const [copied, setCopied] = useState(false);
	const handleClose = (value: boolean) => {
		if (typeof setOpen === "function") {
			setOpen(value);
		}
	};
	const handleCopy = () => {
		const input = document.getElementById("link") as HTMLInputElement | null;
		if (!input) return;

		const textToCopy = input.value;
		if (navigator.clipboard && window.isSecureContext) {
			navigator.clipboard
				.writeText(textToCopy)
				.then(() => {
					setCopied(true);
					setTimeout(() => setCopied(false), 2000);
				})
				.catch((err) => {
					console.error(err);
				});
		} else {
			input.select();
			input.setSelectionRange(0, 99999);
			try {
				const success = document.execCommand("copy");
				if (success) {
					setCopied(true);
					setTimeout(() => setCopied(false), 2000);
				}
			} catch (err) {
				console.error(err);
			}
		}
	};

	const handleSocialShare = (platform: string) => {
		const url = encodeURIComponent(text);
		const shareText = encodeURIComponent("Check this out!");

		const shareUrls: Record<string, string> = {
			facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
			twitter: `https://twitter.com/intent/tweet?url=${url}&text=${shareText}`,
			linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
			whatsapp: `https://wa.me/?text=${shareText}%20${url}`,
			telegram: `https://t.me/share/url?url=${url}&text=${shareText}`,
			reddit: `https://reddit.com/submit?url=${url}&title=${shareText}`,
		};

		const width = 800;
		const height = 800;
		const left = (window.screen.width - width) / 2;
		const top = (window.screen.height - height) / 2;

		window.open(
			shareUrls[platform],
			"_blank",
			`width=${width},height=${height},left=${left},top=${top}`,
		);
	};
	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Share link</DialogTitle>
					<DialogDescription>
						Anyone who has this link will be able to view this.
					</DialogDescription>
				</DialogHeader>
				<div className="flex items-center space-x-2">
					<div className="grid flex-1 gap-2">
						<Label htmlFor="link" className="sr-only">
							Link
						</Label>
						<Input id="link" defaultValue={text} readOnly />
					</div>
					<Button
						type="button"
						size="sm"
						className="px-3 relative flex items-center justify-center transition-all"
						onClick={handleCopy}
					>
						<span className="sr-only">Copy</span>
						<span
							className={`absolute transition-all duration-300 ease-in-out ${copied ? "opacity-0 scale-90" : "opacity-100 scale-110"
								}`}
						>
							<Copy />
						</span>

						<span
							className={`transition-all duration-300 ease-in-out ${copied ? "opacity-100 scale-100" : "opacity-0 scale-90"
								}`}
						>
							<Check className="text-green-500" />
						</span>
					</Button>
				</div>

				<div className="mt-2">
					<Label className="text-sm font-medium mb-3 block">
						Share on social media
					</Label>
					<div className="grid grid-cols-3 gap-3">
						{socialPlatforms.map((social) => {
							const Icon = social.icon;
							return (
								<Button
									key={social.platform}
									variant="outline"
									className="flex items-center gap-2 justify-center"
									onClick={() => handleSocialShare(social.platform)}
								>
									<Icon className="h-5 w-5 text-foreground" />
									<span className="text-sm">{social.label}</span>
								</Button>
							);
						})}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
