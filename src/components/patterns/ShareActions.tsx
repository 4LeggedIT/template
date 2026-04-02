import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Copy, Facebook, Twitter } from "lucide-react";

type ShareChannel = "facebook" | "x" | "copy";

type ShareActionsProps = {
  url: string;
  title: string;
  text?: string;
  className?: string;
  channels?: ShareChannel[];
};

const defaultChannels: ShareChannel[] = ["facebook", "x", "copy"];

const ShareActions = ({
  url,
  title,
  text,
  className,
  channels = defaultChannels,
}: ShareActionsProps) => {
  const [shareState, setShareState] = useState<"idle" | "copied" | "shared">("idle");

  const message = useMemo(() => [title, text].filter(Boolean).join(" — "), [text, title]);

  const facebookUrl = useMemo(() => {
    const params = new URLSearchParams({ u: url });
    return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
  }, [url]);

  const xUrl = useMemo(() => {
    const params = new URLSearchParams({ url, text: message });
    return `https://twitter.com/intent/tweet?${params.toString()}`;
  }, [message, url]);

  const shareOrCopyLink = async () => {
    try {
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share({
          title,
          text: text ?? undefined,
          url,
        });
        setShareState("shared");
        window.setTimeout(() => setShareState("idle"), 1800);
        return;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setShareState("copied");
      window.setTimeout(() => setShareState("idle"), 1800);
    } catch {
      setShareState("idle");
    }
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {channels.includes("facebook") ? (
        <Button asChild variant="outline" size="sm">
          <a href={facebookUrl} target="_blank" rel="noopener noreferrer">
            <Facebook className="h-4 w-4" />
            Facebook
          </a>
        </Button>
      ) : null}
      {channels.includes("x") ? (
        <Button asChild variant="outline" size="sm">
          <a href={xUrl} target="_blank" rel="noopener noreferrer">
            <Twitter className="h-4 w-4" />
            X
          </a>
        </Button>
      ) : null}
      {channels.includes("copy") ? (
        <Button type="button" variant="outline" size="sm" onClick={shareOrCopyLink}>
          <Copy className="h-4 w-4" />
          {shareState === "shared" ? "Shared" : shareState === "copied" ? "Copied" : "Share"}
        </Button>
      ) : null}
    </div>
  );
};

export default ShareActions;
