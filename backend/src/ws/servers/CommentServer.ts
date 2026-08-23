import { IncomingMessage } from "node:http";
import { Socket } from "node:net";
import WebSocket, { RawData, WebSocketServer } from "ws";
import { JwtHelper } from "../../lib/jwt.js";
import { logger } from "../../lib/logger.js";
import { WsCommentHandler } from "../handler/WsCommentHandler.js";

export class CommentServer {
    private readonly commentServer: WebSocketServer;
    private readonly jwtHelper: JwtHelper;
    private rooms: Map<string, Set<WebSocket>>;

    constructor() {
        this.jwtHelper = new JwtHelper();
        this.rooms = new Map<string, Set<WebSocket>>();
        this.commentServer = new WebSocketServer({ noServer: true });

        this.commentServer.on(
            "connection",
            async (websocket: WebSocket, request: IncomingMessage) => {
                try {
                    const token = this.jwtHelper.parseJwtFromRequest(request);
                    if (!token) {
                        logger.warn({ url: request.url }, "comment ws missing token");
                        websocket.close(4401, "MISSING_TOKEN");
                        return;
                    }
                    const userDetails = await this.jwtHelper.verifyAccessToken(token);
                    const user = {
                        id: (userDetails.id || userDetails.sub) as string,
                        name: (userDetails.name || "User") as string,
                    };

                    const room = this.getRoom(request);
                    if (room == null) {
                        logger.warn({ url: request.url }, "comment ws missing room");
                        websocket.close(4404, "ROOM NOT FOUND");
                        return;
                    }
                    this.joinRoom(room, websocket);
                    websocket.on("message", (message: RawData) => {
                        void WsCommentHandler.handleMessage(
                            message,
                            this.rooms,
                            room,
                            websocket,
                            user.id,
                            user.name,
                        );
                    });
                    websocket.on("close", () => {
                        this.leaveRoom(room, websocket);
                    });
                } catch (error) {
                    logger.error({ err: error, url: request.url }, "comment ws auth failed");
                    websocket.close(4401, "TOKEN_EXPIRED");
                }
            },
        );
    }

    public async handleUpgrade(
        request: IncomingMessage,
        socket: Socket,
        head: Buffer,
    ): Promise<void> {
        this.commentServer.handleUpgrade(
            request,
            socket,
            head,
            (ws, req) => {
                this.commentServer.emit("connection", ws, req);
            },
        );
    }

    public joinRoom(room: string, websocket: WebSocket): void {
        if (!this.rooms.get(room)) {
            this.rooms.set(room, new Set());
        }
        this.rooms.get(room)!.add(websocket);
    }

    public leaveRoom(room: string, websocket: WebSocket): void {
        const members = this.rooms.get(room);
        if (!members) {
            return;
        }

        members.delete(websocket);
        if (members.size === 0) {
            this.rooms.delete(room);
        }
    }

    public getRoom(request: IncomingMessage): string | null {
        const url = new URL(request.url ?? "", "http://localhost");
        const room = url.searchParams.get("room");
        return room;
    }
}
