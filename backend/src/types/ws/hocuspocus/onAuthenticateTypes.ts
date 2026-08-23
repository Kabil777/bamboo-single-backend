import { IncomingMessage } from "node:http";

export type AuthUser = {
    id: string;
    tokenExpiresAt?: number;
    email?: string;
    name?: string;
};

export type AuthContext = {
    user: AuthUser;
    role: string;
    tokenExpiresAt?: number;
};

export type ConnectionConfig = {
    readOnly?: boolean;
    user?: AuthUser;
    context?: AuthContext;
    [key: string]: unknown;
};

export type OnAuthenticationArgs = {
    request: IncomingMessage;
    documentName: string;
    connectionConfig: ConnectionConfig;
};

export type OnAuthenticateResult = {
    user: AuthUser;
    role: string;
    tokenExpiresAt?: number;
};
