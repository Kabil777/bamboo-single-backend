// Legacy docs navigation is intentionally inert after collaboration removal.
export function useDocsTree(_provider: unknown) {
    return { tree: [] as Array<{ id: string; title: string }>, addPage: () => undefined, deletePage: () => undefined };
}
