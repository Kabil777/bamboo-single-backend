type UUID = string;

interface userBase {
	id?: UUID;
	name: string;
	handle: string;
	email?: string;
}

interface socialLink {
	platform:
		| "GITHUB"
		| "LINKEDIN"
		| "YOUTUBE"
		| "TWITTER"
		| "DISCORD"
		| "WEBSITE";
}

interface userProfile extends userBase {
	description?: string;
	coverUrl?: string;
	designation?: string;
	profile?: {
		tags?: string[];
		social?: Record<string, string>;
	};
}

interface userUpdatePayload {
	name?: string;
	handle?: string;
	description?: string;
	coverUrl?: string;
	designation?: string;
	userProfile?: {
		tags?: string[];
		social?: Record<string, string>;
	};
}

export type { userBase, userProfile, socialLink, userUpdatePayload };
