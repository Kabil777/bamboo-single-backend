import WebSocket, { RawData } from "ws";

export type TypingMessage = {
    status: "TYPING";
    timestamp: string;
};

export type PublishedMessage = {
    status: "PUBLISHED";
    content: string;
    timestamp: string;
    isReply: boolean;
    replyId: string | null;
};

export type DeleteMessage = {
    status: "DELETE";
    id: string;
    timestamp: string;
    isReply: boolean;
    replyId: string | null;
};

export type MessageFormat = TypingMessage | PublishedMessage | DeleteMessage;

export type CommentEvent =
    | {
          type: "COMMENT_PUBLISHED";
          room: string;
          userId: string;
          content: string;
          timestamp: string;
          isReply: boolean;
          replyId: string | null;
      }
    | {
          type: "COMMENT_DELETED";
          room: string;
          commentId: string;
          userId: string;
          timestamp: string;
          isReply: boolean;
          replyId: string | null;
      };

export class WsCommentHandler {
    private constructor() {}

    public static broadcast(
        rooms: Map<string, Set<WebSocket>>,
        room: string,
        payload: string,
        sender?: WebSocket,
    ) {
        const members = rooms.get(room);
        if (!members) return;

        for (const client of members) {
            if (client === sender) continue;
            if (client.readyState !== WebSocket.OPEN) continue;
            client.send(payload);
        }
    }

    public static handleMessage = async (
        message: RawData,
        rooms: Map<string, Set<WebSocket>>,
        room: string,
        websocket: WebSocket,
        userId: string,
        userName: string,
    ): Promise<void> => {
        try {
            const incomingMessage: MessageFormat = JSON.parse(message.toString());

            if (incomingMessage.status === "TYPING") {
                WsCommentHandler.broadcast(
                    rooms,
                    room,
                    JSON.stringify({
                        status: "TYPING",
                        userId,
                        userName,
                        timestamp: new Date().toISOString(),
                    }),
                    websocket,
                );
                return;
            }

            if (incomingMessage.status === "PUBLISHED") {
                const event = {
                    type: "COMMENT_PUBLISHED",
                    room,
                    userId,
                    userName,
                    content: incomingMessage.content,
                    timestamp: new Date().toISOString(),
                    isReply: incomingMessage.isReply,
                    replyId: incomingMessage.replyId,
                };

                WsCommentHandler.broadcast(
                    rooms,
                    room,
                    JSON.stringify(event),
                    websocket,
                );
                return;
            }

            if (incomingMessage.status === "DELETE") {
                const event = {
                    type: "COMMENT_DELETED",
                    room,
                    userId,
                    userName,
                    isReply: incomingMessage.isReply,
                    commentId: incomingMessage.id,
                    timestamp: new Date().toISOString(),
                    replyId: incomingMessage.replyId,
                };

                WsCommentHandler.broadcast(
                    rooms,
                    room,
                    JSON.stringify(event),
                    websocket,
                );
            }
        } catch {
            // ignore invalid comment message
        }
    };
}
