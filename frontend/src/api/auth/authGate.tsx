let resolveAuth: (() => void) | null = null;

export const authResolved = new Promise<void>((resolve) => {
    resolveAuth = resolve;
});

export const signalAuthResolved = () => {
    if (resolveAuth) {
        resolveAuth();
        resolveAuth = null;
    }
};
