/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

type StorageType = {
  enabled?: boolean;
};

const HoverDownloader = () => {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [url, setUrl] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  // ✅ Load toggle state
  useEffect(() => {
    chrome.storage.sync.get(["enabled"], (res: StorageType) => {
      setEnabled(res.enabled ?? true);
    });

    const listener = (changes: {
      [key: string]: chrome.storage.StorageChange;
    }) => {
      if (changes.enabled) {
        setEnabled(changes.enabled.newValue as boolean);
      }
    };

    chrome.storage.onChanged.addListener(listener);

    return () => {
      chrome.storage.onChanged.removeListener(listener);
    };
  }, []);

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
      // 🔥 STOP everything if disabled
      if (!enabled) {
        setVisible(false);
        return;
      }


      const targetEl = e.target as HTMLElement;

      // prevent flicker
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

      setPreviewUrl(mediaUrl);
      setIsVideo(mediaUrl.includes(".mp4")); // simple detection


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
  }, [enabled]);

  const download = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!url) return;

    const filename =
      url.split("/").pop()?.split("?")[0] || `file-${Date.now()}`;

    chrome.runtime.sendMessage({
      type: "DOWNLOAD",
      url,
      filename
    });
  };

return visible ? (
  <>
    {/* Download Button */}
    <div
      className="hover-btn"
      onClick={download}
      style={{
        position: "absolute",
        top: pos.top,
        left: pos.left,
        zIndex: 999999,
        backdropFilter: "blur(10px)",
        background: "rgba(0,0,0,0.6)",
        color: "#fff",
        padding: "6px 12px",
        borderRadius: "999px",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: 500,
        border: "1px solid rgba(255,255,255,0.2)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        transition: "all 0.2s ease"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      ⬇ Download
    </div>

    {/* Preview Card */}
    {previewUrl && (
      <div
        style={{
          position: "absolute",
          top: pos.top + 45,
          left: pos.left,
          zIndex: 999998,
          width: 220,
          borderRadius: "12px",
          overflow: "hidden",
          backdropFilter: "blur(12px)",
          background: "rgba(0,0,0,0.6)",
          border: "1px solid rgba(255,255,255,0.15)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          animation: "fadeIn 0.2s ease"
        }}
      >
        {isVideo ? (
          <video
            src={previewUrl}
            width="100%"
            muted
            autoPlay
            loop
            style={{ display: "block" }}
          />
        ) : (
          <img
            src={previewUrl}
            width="100%"
            style={{ display: "block" }}
          />
        )}

        {/* Footer */}
        <div
          style={{
            padding: "6px 8px",
            fontSize: "12px",
            color: "#ccc",
            textAlign: "center"
          }}
        >
          Preview
        </div>
      </div>
    )}
  </>
) : null;
};

// Inject React App
const container = document.createElement("div");
container.id = "hover-downloader-root";
document.body.appendChild(container);

createRoot(container).render(<HoverDownloader />);