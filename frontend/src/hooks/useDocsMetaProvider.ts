import { HocuspocusProvider } from "@hocuspocus/provider";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { buildCollabRoomName } from "@/lib/collabRoomName";
import { COLLAB_URL } from "@/lib/collabConfig";
import {
    isWsForbidden,
    refreshSessionForCollab,
    shouldRefreshWsAuth,
} from "@/lib/collabAuth";

export function useDocsMetaProvider(
    docId: string | undefined,
    options?: { enabled?: boolean },
) {
    const router = useRouter();
    const [provider, setProvider] = useState<HocuspocusProvider | null>(null);
    const forbiddenNotifiedRef = useRef(false);
    const expiredNotifiedRef = useRef(false);

    useEffect(() => {
        const enabled = options?.enabled ?? true;
        if (!enabled) {
            setProvider(null);
            return;
        }
        if (!docId) return;
        let provider: HocuspocusProvider | null = null;
        forbiddenNotifiedRef.current = false;
        expiredNotifiedRef.current = false;

        const p = new HocuspocusProvider({
            url: COLLAB_URL,
            name: buildCollabRoomName("docs-sidebar", docId),
            onAuthenticationFailed: async ({ reason }) => {
                if (isWsForbidden(undefined, reason)) {
                    if (!forbiddenNotifiedRef.current) {
                        forbiddenNotifiedRef.current = true;
                        toast.error("You do not have access to this document.");
                    }
                    provider?.destroy();
                    router.push("/forbidden");
                    return;
                }

                try {
                    await refreshSessionForCollab();
                    await provider?.connect();
                } catch {
                    if (!expiredNotifiedRef.current) {
                        expiredNotifiedRef.current = true;
                        toast.warning(
                            "Session expired. Please sign in again.",
                        );
                    }
                    provider?.destroy();
                    router.replace("/login");
                }
            },
            onClose: async ({ event }) => {
                if (isWsForbidden(event?.code, event?.reason)) {
                    if (!forbiddenNotifiedRef.current) {
                        forbiddenNotifiedRef.current = true;
                        toast.error("You do not have access to this document.");
                    }
                    provider?.destroy();
                    router.push("/forbidden");
                    return;
                }

                if (!shouldRefreshWsAuth(event?.code, event?.reason)) {
                    return;
                }

                try {
                    await refreshSessionForCollab();
                    await provider?.connect();
                } catch {
                    if (!expiredNotifiedRef.current) {
                        expiredNotifiedRef.current = true;
                        toast.warning(
                            "Session expired. Please sign in again.",
                        );
                    }
                    provider?.destroy();
                    router.replace("/login");
                }
            },
        });
        provider = p;

        setProvider(p);

        return () => {
            p.destroy();
            setProvider(null);
        };
    }, [docId, router, options?.enabled]);

    return provider;
}
