import { HocuspocusProvider } from "@hocuspocus/provider";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { buildCollabRoomName, type CollabRoomType } from "./collabRoomName";
import { COLLAB_URL } from "./collabConfig";
import {
    isWsForbidden,
    refreshSessionForCollab,
    shouldRefreshWsAuth,
} from "./collabAuth";

export function useHocuspocusProvider(
    documentId: string,
    roomType: CollabRoomType,
    parentId?: string,
    options?: { enabled?: boolean },
) {
    const router = useRouter();
    const providerRef = useRef<HocuspocusProvider | null>(null);
    const [provider, setProvider] = useState<HocuspocusProvider | null>(null);
    const forbiddenNotifiedRef = useRef(false);
    const expiredNotifiedRef = useRef(false);

    useEffect(() => {
        const enabled = options?.enabled ?? true;
        if (!enabled) {
            if (providerRef.current) {
                providerRef.current.destroy();
                providerRef.current = null;
            }
            setProvider(null);
            return;
        }
        const roomName = buildCollabRoomName(roomType, documentId, parentId);

        if (
            !providerRef.current ||
            providerRef.current.configuration.name !== roomName
        ) {
            if (providerRef.current) {
                providerRef.current.destroy();
            }
            forbiddenNotifiedRef.current = false;
            expiredNotifiedRef.current = false;

            const newProvider = new HocuspocusProvider({
                url: COLLAB_URL,
                name: roomName,
                onAuthenticationFailed: async ({ reason }) => {
                    if (isWsForbidden(undefined, reason)) {
                        if (!forbiddenNotifiedRef.current) {
                            forbiddenNotifiedRef.current = true;
                            toast.error(
                                "You do not have access to this document.",
                            );
                        }
                        providerRef.current?.destroy();
                        router.push("/forbidden");
                        return;
                    }

                    try {
                        await refreshSessionForCollab();
                        await providerRef.current?.connect();
                    } catch {
                        if (!expiredNotifiedRef.current) {
                            expiredNotifiedRef.current = true;
                            toast.warning(
                                "Session expired. Please sign in again.",
                            );
                        }
                        providerRef.current?.destroy();
                        router.replace("/login");
                    }
                },
                onClose: async ({ event }) => {
                    if (isWsForbidden(event?.code, event?.reason)) {
                        if (!forbiddenNotifiedRef.current) {
                            forbiddenNotifiedRef.current = true;
                            toast.error(
                                "You do not have access to this document.",
                            );
                        }
                        providerRef.current?.destroy();
                        router.push("/forbidden");
                        return;
                    }

                    if (!shouldRefreshWsAuth(event?.code, event?.reason)) {
                        return;
                    }

                    try {
                        await refreshSessionForCollab();
                        await providerRef.current?.connect();
                    } catch {
                        if (!expiredNotifiedRef.current) {
                            expiredNotifiedRef.current = true;
                            toast.warning(
                                "Session expired. Please sign in again.",
                            );
                        }
                        providerRef.current?.destroy();
                        router.replace("/login");
                    }
                },
            });

            providerRef.current = newProvider;
            setProvider(newProvider);
        }

        return () => {
            // Cleanup on unmount
            if (providerRef.current) {
                providerRef.current.destroy();
                providerRef.current = null;
            }
        };
    }, [documentId, roomType, parentId, router, options?.enabled]);

    return provider;
}
