import React from "react";

// Comment WebSocket UI removed with the collaboration service.
interface CommentsDrawerProps {
    children?: React.ReactNode;
    contentId?: string;
    contentType?: string;
    [key: string]: any;
}

function CommentsDrawer({ children }: CommentsDrawerProps) {
    return <>{children ?? null}</>;
}

export { CommentsDrawer };
export default CommentsDrawer;
