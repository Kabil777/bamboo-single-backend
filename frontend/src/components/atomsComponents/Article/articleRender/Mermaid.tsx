"use client";

import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { Maximize2, ZoomIn, ZoomOut, RefreshCcw } from "lucide-react";
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/shadcnUI/dialog";

const ZoomControls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  return (
    <div className="absolute bottom-6 right-6 z-50 flex gap-2 bg-background/80 backdrop-blur border rounded-md p-1 shadow-sm">
      <button onClick={() => zoomIn()} className="p-2 hover:bg-muted rounded-sm transition-colors text-foreground" title="Zoom In">
        <ZoomIn className="h-4 w-4" />
      </button>
      <button onClick={() => zoomOut()} className="p-2 hover:bg-muted rounded-sm transition-colors text-foreground" title="Zoom Out">
        <ZoomOut className="h-4 w-4" />
      </button>
      <button onClick={() => resetTransform()} className="p-2 hover:bg-muted rounded-sm transition-colors text-foreground" title="Reset Zoom">
        <RefreshCcw className="h-4 w-4" />
      </button>
    </div>
  );
};

mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "loose",
  fontFamily: "var(--font-geist)",
});

export function Mermaid({ chart }: { chart: string }) {
  const [svg, setSvg] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    
    const renderChart = async () => {
      try {
        console.log("Mermaid chart to render:", chart);
        if (containerRef.current) {
          const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
          const { svg: renderedSvg } = await mermaid.render(id, chart);
          if (isMounted) {
            setSvg(renderedSvg);
          }
        }
      } catch (error) {
        console.warn("Failed to render mermaid diagram", error);
        if (isMounted) {
          setSvg(`<div class="text-red-500 bg-red-50 p-4 rounded border border-red-200">Syntax error in diagram</div>`);
        }
      }
    };

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart]);

  return (
    <div className="relative group my-8">
      <div 
        ref={containerRef}
        className="mermaid-wrapper flex justify-center w-full overflow-x-auto border rounded-lg p-4 bg-muted/20 transition-all hover:bg-muted/40 cursor-pointer"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {svg && !svg.includes("Syntax error in diagram") && (
        <Dialog>
          <DialogTrigger asChild>
            <button 
              className="absolute top-4 right-4 p-2 rounded-md bg-background/80 hover:bg-background shadow-sm opacity-0 group-hover:opacity-100 transition-opacity border text-foreground"
              aria-label="View Fullscreen"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] sm:max-w-[95vw] w-full h-[90vh] flex flex-col p-2 sm:p-6 bg-background">
            <DialogTitle className="sr-only">Mermaid Diagram Fullscreen</DialogTitle>
            <div className="w-full h-full overflow-hidden rounded-lg bg-muted/10 relative border">
              <TransformWrapper
                initialScale={1}
                minScale={0.1}
                maxScale={8}
                centerOnInit={true}
                wheel={{ step: 0.1 }}
              >
                <ZoomControls />
                <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full flex items-center justify-center">
                  <div 
                    className="mermaid-fullscreen flex justify-center w-full"
                    dangerouslySetInnerHTML={{ __html: svg }}
                  />
                </TransformComponent>
              </TransformWrapper>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
