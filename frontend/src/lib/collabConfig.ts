const DEFAULT_COLLAB_URL = typeof window !== 'undefined' ? `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/collab` : "ws://localhost:8092/collab";

export const COLLAB_URL = process.env.NEXT_PUBLIC_COLLAB_WS_URL || DEFAULT_COLLAB_URL;
