/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

const HoverDownloader = () => {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let currentTarget: HTMLElement | null = null;

    const findMediaElement = (el: HTMLElement | null): HTMLElement | null => {
      while (el) {
        if (
          el.tagName === "IMG" ||
          el.tagName === "VIDEO" ||
          (el.tagName === "A" &&
            /\.(mp4|jpg|png|jpeg|gif)$/i.test(
              (el as HTMLAnchorElement).href
            ))
        ) {
          return el;
        }
        el = el.parentElement;
      }
      return null;
    };

    const getMediaUrl = (el: HTMLElement): string | null => {
      if (el.tagName === "IMG") return (el as HTMLImageElement).src;
      if (el.tagName === "VIDEO")
        return (el as HTMLVideoElement).currentSrc || el.getAttribute("src");
      if (el.tagName === "A") return (el as HTMLAnchorElement).href;
      return null;
    };

    const handleMove = (e: MouseEvent) => {
      const targetEl = e.target as HTMLElement;

      if (targetEl.closest(".hover-btn")) return;

      const target = findMediaElement(targetEl);

      if (!target) {
        setVisible(false);
        currentTarget = null;
        return;
      }

      if (currentTarget === target) return;
      currentTarget = target;

      const rect = target.getBoundingClientRect();
      const mediaUrl = getMediaUrl(target);

      if (!mediaUrl) return;

      setPos({
        top: rect.top + window.scrollY + 10,
        left: rect.left + window.scrollX + 10
      });

      setUrl(mediaUrl);
      setVisible(true);
    };

    document.addEventListener("mousemove", handleMove);

    return () => {
      document.removeEventListener("mousemove", handleMove);
    };
  }, []);

  const download = (e: React.MouseEvent) => {
  e.stopPropagation();
  e.preventDefault();

  if (!url) return;

  const filename = url.split("/").pop()?.split("?")[0];

  chrome.runtime.sendMessage({
    type: "DOWNLOAD",
    url,
    filename
  });
};

  return visible ? (
    <div
      className="hover-btn"
      style={{
        position: "absolute",
        top: pos.top,
        left: pos.left,
        zIndex: 999999,
        background: "wheat",
        color: "black",
        padding: "6px 8px",
        borderRadius: "6px",
        cursor: "pointer",
        pointerEvents: "auto"
      }}
      onClick={download}
    >
      👇 Download
    </div>
  ) : null;
};

// Inject React App safely
const container = document.createElement("div");
container.id = "hover-downloader-root";
document.body.appendChild(container);

createRoot(container).render(<HoverDownloader />);