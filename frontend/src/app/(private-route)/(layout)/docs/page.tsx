"use client";

import { DocsCard } from "@/components/atomsComponents";
import { useAppDispatch, useAppState } from "@/hooks/ReduxHooks";
import { DocsCoverRtk } from "@/store/reducers/DocsCoverReducer";
import { useEffect } from "react";

export default function Docs() {
  const dispatch = useAppDispatch();
  const { docs, isDocsLoading, fetched } = useAppState((state) => state.docsHomeReducer);

  useEffect(() => {
    if (!fetched) dispatch(DocsCoverRtk());
  }, [dispatch, fetched]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 border-b border-foreground/[0.08] pb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/50">Library</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Documentation</h1>
      </div>
      {isDocsLoading ? (
        <p className="text-sm text-muted-foreground">Loading documentation…</p>
      ) : docs.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {docs.map((doc) => (
            <DocsCard key={doc.id} hoverOpen={false} doc={doc} active="" setActiveCard={() => {}} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No documentation has been published yet.</p>
      )}
    </main>
  );
}
