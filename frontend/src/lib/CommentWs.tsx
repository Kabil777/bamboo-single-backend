"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
    isWsForbidden,
    refreshSessionForCollab,
    shouldRefreshWsAuth,
} from "./collabAuth";

export function useCommentWebSocket(
    room: string | null,
    options?: { enabled?: boolean },
) {
    const router = useRouter();
    const socketRef = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState<string | null>(null);
    const [retryKey, setRetryKey] = useState(0);
    const forbiddenNotifiedRef = useRef(false);
    const expiredNotifiedRef = useRef(false);

    useEffect(() => {
        const enabled = options?.enabled ?? true;
        if (!enabled || !room) {
            socketRef.current?.close();
            socketRef.current = null;
            setIsConnected(false);
            setLastMessage(null);
            return;
        }

        const wsUrl = process.env.NEXT_PUBLIC_COMMENT_WS_URL;
        if (!wsUrl) {
            console.error("NEXT_PUBLIC_COMMENT_WS_URL is not configured");
            return;
        }

        forbiddenNotifiedRef.current = false;
        expiredNotifiedRef.current = false;

        const socket = new WebSocket(
            `${wsUrl}?room=${encodeURIComponent(room)}`,
        );

        socketRef.current = socket;

        socket.onopen = () => {
            setIsConnected(true);
        };

        socket.onmessage = (event) => {
            if (typeof event.data === "string") {
                setLastMessage(event.data);
            }
        };

        socket.onclose = async (event) => {
            setIsConnected(false);

            if (isWsForbidden(event.code, event.reason)) {
                if (!forbiddenNotifiedRef.current) {
                    forbiddenNotifiedRef.current = true;
                    toast.error(
                        "You do not have access to this comment thread.",
                    );
                }
                router.push("/forbidden");
                return;
            }

            if (!shouldRefreshWsAuth(event.code, event.reason)) {
                return;
            }

            try {
                await refreshSessionForCollab();
                setRetryKey((value) => value + 1);
            } catch {
                if (!expiredNotifiedRef.current) {
                    expiredNotifiedRef.current = true;
                    toast.warning("Session expired. Please sign in again.");
                }
                router.replace("/login");
            }
        };

        return () => {
            socket.close();
            socketRef.current = null;
            setIsConnected(false);
        };
    }, [room, router, options?.enabled, retryKey]);

    const sendMessage = useCallback((payload: unknown) => {
        const socket = socketRef.current;
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            return false;
        }

        socket.send(JSON.stringify(payload));
        return true;
    }, []);

    return {
        socketRef,
        isConnected,
        lastMessage,
        sendMessage,
    };
}
