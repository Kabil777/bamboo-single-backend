import { Check, FileText, Link2, Upload, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/shadcnUI/select";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/shadcnUI/avatar";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/shadcnUI/alert-dialog";
import api from "@/api/axios";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import type { userAwareness } from "@/hooks/useCollabrationAwareness";
import { FloatingActionBar, Popup } from "@/components/atomsComponents";

type InvitedUser = {
    userId?: string;
    email?: string | null;
    name?: string | null;
    handle?: string | null;
    coverUrl?: string | null;
    role: "owner" | "can edit" | "can view";
};
type CollabUser = { name?: string };
type InviteRole = "can edit" | "can view";
type ApiRole = "OWNER" | "EDITOR" | "READER";
type BlogMemberRoleResponse = {
    userId: string;
    userName: string | null;
    userHandle: string | null;
    userCoverUrl: string | null;
    userEmail: string | null;
    role: ApiRole;
};
type DocsMemberRoleResponse = {
    userId: string;
    name: string | null;
    handle: string | null;
    coverUrl: string | null;
    email: string | null;
    role: ApiRole;
};

const buildApiUrl = (path: string) => {
    const base = (typeof window !== 'undefined' ? "" : (process.env.NEXT_PUBLIC_API_SERVER_URL || "")).replace(
        /\/+$/,
        "",
    );
    const version = (process.env.NEXT_PUBLIC_API_VERSION || "").replace(
        /^\/+|\/+$/g,
        "",
    );
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return version
        ? `${base}/${version}${normalizedPath}`
        : `${base}${normalizedPath}`;
};

export const ToolBarBottom = ({
    editor,
    onSave,
    collabUser,
    invitedUsers,
    setInvitedUsers,
    resourceType,
    resourceId,
    onlineUsers,
    word,
    children,
    onImportContent,
}: {
    editor?: any;
    onSave: (visibility: "PUBLIC" | "PRIVATE") => void;
    collabUser: CollabUser;
    invitedUsers: InvitedUser[];
    setInvitedUsers: React.Dispatch<React.SetStateAction<InvitedUser[]>>;
    resourceType: "blog" | "docs";
    resourceId: string;
    onlineUsers: userAwareness[];
    word: number;
    children?: React.ReactNode;
    onImportContent?: (htmlContent: string) => void;
}) => {
    const [openColab, setOpenColab] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const [openUpload, setOpenUpload] = useState(false);
    const [isSubmittingInvite, setIsSubmittingInvite] = useState(false);
    const [inviteRole, setInviteRole] = useState<InviteRole>("can edit");
    const [isOwner, setIsOwner] = useState(false);
    const [isLoadingMembers, setIsLoadingMembers] = useState(false);
    const [openMd, setOpenMd] = useState(false);
    const [publishVisibility, setPublishVisibility] = useState<
        "PUBLIC" | "PRIVATE"
    >("PRIVATE");
    const isBlogInviteSupported = resourceType === "blog";
    const isDocsInviteSupported = resourceType === "docs";

    const roleToApi = (role: string) =>
        role === "can view" ? "READER" : "EDITOR";
    const apiToUiRole = (role: ApiRole): InvitedUser["role"] =>
        role === "OWNER"
            ? "owner"
            : role === "EDITOR"
                ? "can edit"
                : "can view";
    const getErrorMessage = (error: unknown, fallback: string) =>
        (error as AxiosError<{ message?: string }>)?.response?.data?.message ||
        fallback;
    const invitedUserById = new Map<string, InvitedUser>();
    invitedUsers.forEach((member) => {
        if (member.userId) invitedUserById.set(member.userId, member);
        if (member.email) invitedUserById.set(member.email, member);
        if (member.handle) invitedUserById.set(member.handle, member);
    });

    const loadRoleAndMembers = async () => {
        if (!isBlogInviteSupported && !isDocsInviteSupported) return;

        setIsLoadingMembers(true);
        try {
            if (isBlogInviteSupported) {
                const [roleRes, membersRes] = await Promise.all([
                    api.get(buildApiUrl(`/blog/role/${resourceId}`)),
                    api.get(buildApiUrl(`/blog/${resourceId}/roles`)),
                ]);

                setIsOwner(roleRes.data?.role === "OWNER");

                const members =
                    (membersRes.data || []) as BlogMemberRoleResponse[];
                setInvitedUsers(
                    members.map((m) => ({
                        userId: m.userId,
                        email: m.userEmail,
                        name: m.userName,
                        handle: m.userHandle,
                        coverUrl: m.userCoverUrl,
                        role: apiToUiRole(m.role),
                    })),
                );
                return;
            }

            const [roleRes, membersRes] = await Promise.all([
                api.get(buildApiUrl(`/docs/role/${resourceId}`)),
                api.get(buildApiUrl(`/docs/${resourceId}/roles`)),
            ]);

            setIsOwner(roleRes.data?.role === "OWNER");

            const members = (membersRes.data || []) as DocsMemberRoleResponse[];
            setInvitedUsers(
                members.map((m) => ({
                    userId: m.userId,
                    email: m.email,
                    name: m.name,
                    handle: m.handle,
                    coverUrl: m.coverUrl,
                    role: apiToUiRole(m.role),
                })),
            );
        } catch (error: unknown) {
            toast.error(getErrorMessage(error, "Failed to load access list"));
        } finally {
            setIsLoadingMembers(false);
        }
    };

    useEffect(() => {
        if (!openColab || (!isBlogInviteSupported && !isDocsInviteSupported))
            return;

        void loadRoleAndMembers();
    }, [
        openColab,
        isBlogInviteSupported,
        isDocsInviteSupported,
        resourceId,
        setInvitedUsers,
    ]);

    const inviteUsers = async (rawInput: string, role: InviteRole) => {
        const emails = rawInput
            .split(",")
            .map((email) => email.trim())
            .filter(Boolean);

        if (emails.length === 0) return;
        if (!isBlogInviteSupported && !isDocsInviteSupported) return;
        if (!isOwner) {
            toast.error("Only owner can share and manage access");
            return;
        }

        setIsSubmittingInvite(true);
        try {
            for (const email of emails) {
                if (
                    invitedUsers.some(
                        (u) =>
                            (u.email || "").toLowerCase() ===
                            email.toLowerCase(),
                    )
                ) {
                    continue;
                }

                if (isBlogInviteSupported) {
                    await api.post(buildApiUrl(`/blog/${resourceId}/roles`), {
                        userEmail: email,
                        role: roleToApi(role),
                    });
                } else {
                    await api.post(buildApiUrl(`/docs/${resourceId}/roles`), {
                        userEmail: email,
                        role: roleToApi(role),
                    });
                }
            }

            await loadRoleAndMembers();
            toast.success("Invites updated");
        } catch (error: unknown) {
            toast.error(getErrorMessage(error, "Failed to invite user"));
        } finally {
            setIsSubmittingInvite(false);
        }
    };

    const updateUserRole = async (email: string, role: InviteRole) => {
        if (!isBlogInviteSupported && !isDocsInviteSupported) return;
        if (!isOwner) {
            toast.error("Only owner can update access");
            return;
        }
        try {
            const endpoint = isBlogInviteSupported
                ? `/blog/${resourceId}/roles`
                : `/docs/${resourceId}/roles`;
            await api.patch(
                buildApiUrl(endpoint),
                { role: roleToApi(role) },
                {
                    params: { targetEmail: email },
                },
            );
            await loadRoleAndMembers();
            toast.success("Role updated");
        } catch (error: unknown) {
            toast.error(getErrorMessage(error, "Failed to update role"));
        }
    };

    const removeUserRole = async (email: string) => {
        if (!isBlogInviteSupported && !isDocsInviteSupported) return;
        if (!isOwner) {
            toast.error("Only owner can revoke access");
            return;
        }
        try {
            const endpoint = isBlogInviteSupported
                ? `/blog/${resourceId}/roles`
                : `/docs/${resourceId}/roles`;
            await api.delete(buildApiUrl(endpoint), {
                params: { targetEmail: email },
            });
            await loadRoleAndMembers();
            toast.success("Access removed");
        } catch (error: unknown) {
            toast.error(getErrorMessage(error, "Failed to remove user"));
        }
    };

    const handleCopyLink = () => {
        // Copy the current URL to clipboard
        navigator.clipboard.writeText(window.location.href);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
    };
    return (
        <>
            {editor !== false && (
                <>
                    <FloatingActionBar
                        prefix={
                            <span className="whitespace-nowrap">
                                {word ?? 0} characters
                            </span>
                        }
                        actions={[
                            {
                                icon: Users,
                                label: "Share this file",
                                onClick: () => setOpenColab(true),
                            },
                            "separator",
                            {
                                icon: Upload,
                                label: "Upload this file",
                                onClick: () => setOpenUpload(true),
                            },
                        ]}
                    >
                        <div className="w-px h-5 bg-border/20 mx-0.5" />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            title="Import Markdown"
                            onClick={() => setOpenMd(true)}
                        >
                            <FileText className="h-4 w-4" />
                        </Button>
                    </FloatingActionBar>

                    <AlertDialog open={openUpload} onOpenChange={setOpenUpload} >
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Upload the blog</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Upload the current content as a blog post.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="grid gap-3">
                                <div className="grid gap-2">
                                    <span className="text-sm font-medium">
                                        Visibility
                                    </span>
                                    <Select
                                        value={publishVisibility}
                                        onValueChange={(value) =>
                                            setPublishVisibility(
                                                value as "PUBLIC" | "PRIVATE",
                                            )
                                        }
                                    >
                                        <SelectTrigger className="w-[160px]">
                                            <SelectValue placeholder="Select visibility" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PRIVATE">
                                                Private
                                            </SelectItem>
                                            <SelectItem value="PUBLIC">
                                                Public
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => onSave(publishVisibility)}
                                >
                                    Upload
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <Dialog open={openColab} onOpenChange={setOpenColab}>
                        <DialogContent className="sm:max-w-[480px] pt-0 overflow-hidden">
                            {/* Header with title and copy link */}
                            <DialogHeader>
                                <div className="flex items-center justify-between border-b py-3 mr-3">
                                    <DialogTitle className="text-base font-semibold">
                                        Share this file
                                    </DialogTitle>
                                    <DialogDescription className="sr-only">
                                        Manage access and invite collaborators to this file.
                                    </DialogDescription>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950 px-2"
                                        onClick={handleCopyLink}
                                    >
                                        {linkCopied ? (
                                            <>
                                                <Check className="w-3.5 h-3.5" />
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Link2 className="w-3.5 h-3.5" />
                                                Copy link
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </DialogHeader>

                            <div className="space-y-3">
                                {/* Invite Input */}
                                <form
                                    className="flex gap-2"
                                    onSubmit={async (e) => {
                                        e.preventDefault();
                                        const form = e.currentTarget as HTMLFormElement;
                                        const emailInput =
                                            (
                                                form.elements.namedItem(
                                                    "email",
                                                ) as HTMLInputElement | null
                                            )?.value || "";
                                        await inviteUsers(emailInput, inviteRole);
                                        form.reset();
                                    }}
                                >
                                    <Input
                                        name="email"
                                        type="email"
                                        placeholder="Add comma separated emails to invite"
                                        className="h-9 flex-1 text-sm bg-muted/50"
                                    />
                                    <Select
                                        value={inviteRole}
                                        onValueChange={(value) =>
                                            setInviteRole(value as InviteRole)
                                        }
                                    >
                                        <SelectTrigger className="h-9 w-28 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem
                                                value="can edit"
                                                className="text-xs"
                                            >
                                                can edit
                                            </SelectItem>
                                            <SelectItem
                                                value="can view"
                                                className="text-xs"
                                            >
                                                can view
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        type="submit"
                                        variant="outline"
                                        className="h-9 px-4 text-sm"
                                        disabled={isSubmittingInvite || !isOwner}
                                    >
                                        {isSubmittingInvite ? "Inviting..." : "Invite"}
                                    </Button>
                                </form>
                                {!isOwner && (
                                    <p className="text-xs text-muted-foreground">
                                        Only owner can share and manage access.
                                    </p>
                                )}

                                <div className="space-y-2 pt-3">
                                    <h3 className="text-xs font-medium mb-2 text-foreground/80">
                                        Online
                                    </h3>
                                    {onlineUsers.length === 0 ? (
                                        <p className="text-xs text-muted-foreground">
                                            No one is online
                                        </p>
                                    ) : (
                                        onlineUsers.map((onlineUser) => {
                                            const memberMeta =
                                                invitedUserById.get(onlineUser.userId) ||
                                                (onlineUser.email ? invitedUserById.get(onlineUser.email) : undefined);
                                            const displayName =
                                                memberMeta?.name ||
                                                memberMeta?.handle ||
                                                (onlineUser.name && onlineUser.name !== "Unknown user" && onlineUser.name !== "Anonymous"
                                                    ? onlineUser.name
                                                    : "User");
                                            const email =
                                                onlineUser.email ||
                                                memberMeta?.email;
                                            const coverUrl =
                                                memberMeta?.coverUrl ||
                                                onlineUser.avatarUrl;

                                            return (
                                                <div
                                                    key={`online-${onlineUser.userId}-${onlineUser.clientId}`}
                                                    className="flex items-center gap-2 py-1 -mx-1 px-1 hover:bg-accent/50 rounded"
                                                >
                                                    <div className="relative">
                                                        <Avatar className="w-7 h-7">
                                                            <AvatarImage
                                                                src={
                                                                    coverUrl ||
                                                                    undefined
                                                                }
                                                                alt={displayName}
                                                            />
                                                            <AvatarFallback>
                                                                {(displayName ||
                                                                    "U")[0]?.toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="absolute -right-0.5 -bottom-0.5 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-[13px] leading-tight truncate">
                                                            {displayName}
                                                            {email && (
                                                                <span className="text-[11px] text-muted-foreground ml-1">
                                                                    ({email})
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                {/* Who has access */}
                                <div className="space-y-2 pt-3">
                                    <h3 className="text-xs font-medium mb-2 text-foreground/80">
                                        Who has access
                                    </h3>

                                    {/* Members */}
                                    {isLoadingMembers && (
                                        <p className="text-xs text-muted-foreground">
                                            Loading members…
                                        </p>
                                    )}
                                    {invitedUsers.map(
                                        ({
                                            userId,
                                            email,
                                            role,
                                            name,
                                            handle,
                                            coverUrl,
                                        }) => (
                                            <div
                                                key={
                                                    userId ||
                                                    email ||
                                                    handle ||
                                                    name ||
                                                    "member"
                                                }
                                                className="flex items-center gap-1 py-1 -mx-1 px-1 hover:bg-accent/50 rounded group"
                                            >
                                                <Avatar className="w-7 h-7">
                                                    <AvatarImage
                                                        src={coverUrl || undefined}
                                                        alt={name || "user"}
                                                    />
                                                    <AvatarFallback>
                                                        {(name ||
                                                            email ||
                                                            "U")[0]?.toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-[13px] leading-tight truncate">
                                                        {name ||
                                                            handle ||
                                                            "Unknown user"}
                                                        <span className="text-[11px] text-muted-foreground">
                                                            {" "}
                                                            (
                                                            {email ||
                                                                "email unavailable"}
                                                            )
                                                        </span>
                                                    </div>
                                                </div>
                                                {role === "owner" ? (
                                                    <span className="text-[11px] text-muted-foreground px-2">
                                                        owner
                                                    </span>
                                                ) : (
                                                    <>
                                                        {isOwner && email && (
                                                            <Button
                                                                size="sm"
                                                                variant="link"
                                                                className="h-7 w-fit p-0"
                                                                onClick={() =>
                                                                    removeUserRole(
                                                                        email,
                                                                    )
                                                                }
                                                            >
                                                                <X className="w-3.5 h-3.5" />
                                                            </Button>
                                                        )}
                                                        <Select
                                                            value={role}
                                                            disabled={!isOwner}
                                                            onValueChange={(
                                                                newRole,
                                                            ) => {
                                                                if (!email) return;
                                                                void updateUserRole(
                                                                    email,
                                                                    newRole as InviteRole,
                                                                );
                                                            }}
                                                        >
                                                            <SelectTrigger className="text-xs gap-1 p-0 !h-fit border-0 text-muted-foreground !bg-transparent hover:bg-transparent focus:ring-0 shadow-none">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem
                                                                    value="can edit"
                                                                    className="text-xs"
                                                                >
                                                                    can edit
                                                                </SelectItem>
                                                                <SelectItem
                                                                    value="can view"
                                                                    className="text-xs"
                                                                >
                                                                    can view
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </>
                                                )}
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Popup
                        open={openMd}
                        setOpen={setOpenMd}
                        editor={editor}
                        onClick={() => {}}
                        onImportContent={onImportContent}
                    />
                </>
            )}
        </>
    );
};
