"use client";

import { useEffect, useState } from "react";

interface DcViewerProps {
  specPath: string;
  title: string;
}

export function DcViewer({ specPath, title }: DcViewerProps) {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);

  useEffect(() => {
    fetch(specPath)
      .then((res) => res.text())
      .then((text) => {
        // Adjust paths for images/scripts relative to /public
        const adjustedText = text
          .replace(/src="\.\/support\.js"/g, 'src="/support.js"')
          .replace(/src="\.\/image-slot\.js"/g, 'src="/image-slot.js"')
          .replace(/src="assets\/nupwb-logo\.jpeg"/g, 'src="/assets/nupwb-logo.jpeg"')
          .replace(/src="uploads\/assets-1786597386579-0t6g\.jpeg"/g, 'src="/uploads/assets-1786597386579-0t6g.jpeg"');
        setHtmlContent(adjustedText);
      })
      .catch((err) => console.error("Error loading design spec:", err));
  }, [specPath]);

  if (!htmlContent) {
    return (
      <div className="flex items-center justify-center p-12 text-[#6E6455] font-sans">
        Loading {title}...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#E7DDC8]">
      <iframe
        srcDoc={htmlContent}
        title={title}
        className="w-full min-h-[90vh] border-0"
        style={{ width: "100%", height: "calc(100vh - 60px)", border: "none" }}
      />
    </div>
  );
}
