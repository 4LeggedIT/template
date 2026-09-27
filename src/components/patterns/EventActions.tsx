import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CalendarPlus, Check, Copy, Facebook, Mail, MapPin, MessageCircle, Share2, Ticket, Twitter } from "lucide-react";
import FormEmbedModal from "@/components/patterns/FormEmbedModal";

type ShareChannel = "maps" | "calendar" | "facebook" | "x" | "whatsapp" | "email" | "copy-url" | "copy-message" | "copy";

export type EventActionsEventDetails = {
  date?: string;
  time?: string;
  location?: string;
};

/**
 * The event's own call to action (sign up / buy tickets). Rendered as the one filled, full-size
 * button at the start of the bar so it can't be missed, and opened in FormEmbedModal (with its
 * "Open in new tab" fallback). Any provider FormEmbedModal can frame works: Jotform, Google Forms,
 * Zeffy ticketing (`https://www.zeffy.com/embed/ticketing/<slug>`).
 */
export type EventActionsRegistration = {
  url: string;
  /** Per-event button text, e.g. "Get tickets". Falls back to `labels.register`. */
  label?: string;
  /** Modal heading. Falls back to the event title. */
  formTitle?: string;
};

export type EventActionsLabels = {
  register?: string;
  openInNewTab?: string;
  /** Heading in front of the share buttons. Pass "" to hide it. */
  shareSection?: string;
  openInMaps?: string;
  addToCalendar?: string;
  facebook?: string;
  x?: string;
  whatsapp?: string;
  email?: string;
  copyMessage?: string;
  share?: string;
  copied?: string;
  shared?: string;
};

type EventActionsProps = {
  url: string;
  title: string;
  text?: string;
  mapsUrl?: string;
  calendarUrl?: string;
  registration?: EventActionsRegistration;
  eventDetails?: EventActionsEventDetails;
  className?: string;
  channels?: ShareChannel[];
  labels?: EventActionsLabels;
};

const defaultChannels: ShareChannel[] = ["facebook", "x", "copy"];

const composeMessage = (
  title: string,
  text: string | undefined,
  details: EventActionsEventDetails | undefined,
  url: string,
): string => {
  const lines: string[] = [title];
  const meta: string[] = [];
  if (details?.date) meta.push(details.date);
  if (details?.time) meta.push(details.time);
  if (meta.length) lines.push(meta.join(" · "));
  if (details?.location) lines.push(details.location);
  if (text) lines.push("", text);
  lines.push("", url);
  return lines.join("\n");
};

const EventActions = ({
  url,
  title,
  text,
  mapsUrl,
  calendarUrl,
  registration,
  eventDetails,
  className,
  channels = defaultChannels,
  labels = {},
}: EventActionsProps) => {
  const {
    register: registerLabel = "Register",
    openInNewTab: openInNewTabLabel = "Open in new tab",
    shareSection: shareSectionLabel = "Share this event",
    openInMaps: openInMapsLabel = "Open in Maps",
    addToCalendar: addToCalendarLabel = "Add to Calendar",
    facebook: facebookLabel = "Facebook",
    x: xLabel = "X",
    whatsapp: whatsappLabel = "WhatsApp",
    email: emailLabel = "Email",
    copyMessage: copyMessageLabel = "Copy event",
    share: shareLabel = "Share",
    copied: copiedLabel = "Copied",
    shared: sharedLabel = "Shared",
  } = labels;

  const [confirmedChannel, setConfirmedChannel] = useState<string | null>(null);

  const normalizedChannels = useMemo(
    () => channels.map((ch) => (ch === "copy" ? "copy-url" : ch)),
    [channels],
  );

  const xMessage = useMemo(() => [title, text].filter(Boolean).join(" — "), [title, text]);
  const richMessage = useMemo(
    () => composeMessage(title, text, eventDetails, url),
    [title, text, eventDetails, url],
  );

  const facebookUrl = useMemo(() => {
    const params = new URLSearchParams({ u: url });
    if (xMessage) params.set("quote", xMessage);
    return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
  }, [url, xMessage]);

  const xUrl = useMemo(() => {
    const params = new URLSearchParams({ url, text: xMessage });
    return `https://twitter.com/intent/tweet?${params.toString()}`;
  }, [xMessage, url]);

  const whatsappUrl = useMemo(
    () => `https://wa.me/?text=${encodeURIComponent(richMessage)}`,
    [richMessage],
  );

  const emailUrl = useMemo(
    () => `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(richMessage)}`,
    [title, richMessage],
  );

  const confirmFor = (key: string) => {
    setConfirmedChannel(key);
    window.setTimeout(() => setConfirmedChannel(null), 1800);
  };

  const handleCopyUrl = async () => {
    try {
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share({ title, text: text ?? undefined, url });
        confirmFor("shared");
        return;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
    }
    try {
      await navigator.clipboard.writeText(url);
      confirmFor("copy-url");
    } catch { /* ignore */ }
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(richMessage);
      confirmFor("copy-message");
    } catch { /* ignore */ }
  };

  const copyUrlConfirmed = confirmedChannel === "copy-url" || confirmedChannel === "shared";

  const registrationUrl = registration?.url?.trim();
  const showMaps = normalizedChannels.includes("maps") && !!mapsUrl;
  const showCalendar = normalizedChannels.includes("calendar") && !!calendarUrl;
  const shareChannels = normalizedChannels.filter((ch) => ch !== "maps" && ch !== "calendar");
  const hasPlanRow = !!registrationUrl || showMaps || showCalendar;
  const hasShareRow = shareChannels.length > 0;

  if (!hasPlanRow && !hasShareRow) return null;

  return (
    <div className={cn("space-y-3", className)}>
      {hasPlanRow ? (
        <div className="flex flex-wrap items-center gap-2">
          {registrationUrl ? (
            <FormEmbedModal
              formUrl={registrationUrl}
              title={registration?.formTitle ?? title}
              labels={{ openInNewTab: openInNewTabLabel }}
            >
              <>
                <Ticket className="h-4 w-4" />
                {registration?.label?.trim() || registerLabel}
              </>
            </FormEmbedModal>
          ) : null}
          {showMaps ? (
            <Button asChild variant="outline" size="sm">
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                <MapPin className="h-4 w-4" />
                {openInMapsLabel}
              </a>
            </Button>
          ) : null}
          {showCalendar ? (
            <Button asChild variant="outline" size="sm">
              <a href={calendarUrl} target="_blank" rel="noopener noreferrer">
                <CalendarPlus className="h-4 w-4" />
                {addToCalendarLabel}
              </a>
            </Button>
          ) : null}
        </div>
      ) : null}
      {hasShareRow ? (
        <div className="flex flex-wrap items-center gap-2">
          {shareSectionLabel ? (
            <span className="mr-1 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
              <Share2 className="h-4 w-4" />
              {shareSectionLabel}
            </span>
          ) : null}
          {normalizedChannels.includes("facebook") ? (
            <Button asChild variant="outline" size="sm">
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer">
                <Facebook className="h-4 w-4" />
                {facebookLabel}
              </a>
            </Button>
          ) : null}
          {normalizedChannels.includes("x") ? (
            <Button asChild variant="outline" size="sm">
              <a href={xUrl} target="_blank" rel="noopener noreferrer">
                <Twitter className="h-4 w-4" />
                {xLabel}
              </a>
            </Button>
          ) : null}
          {normalizedChannels.includes("whatsapp") ? (
            <Button asChild variant="outline" size="sm">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" />
                {whatsappLabel}
              </a>
            </Button>
          ) : null}
          {normalizedChannels.includes("email") ? (
            <Button asChild variant="outline" size="sm">
              <a href={emailUrl}>
                <Mail className="h-4 w-4" />
                {emailLabel}
              </a>
            </Button>
          ) : null}
          {normalizedChannels.includes("copy-url") ? (
            <Button type="button" variant="outline" size="sm" onClick={handleCopyUrl}>
              {copyUrlConfirmed ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {confirmedChannel === "shared" ? sharedLabel : copyUrlConfirmed ? copiedLabel : shareLabel}
            </Button>
          ) : null}
          {normalizedChannels.includes("copy-message") ? (
            <Button type="button" variant="outline" size="sm" onClick={handleCopyMessage}>
              {confirmedChannel === "copy-message" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {confirmedChannel === "copy-message" ? copiedLabel : copyMessageLabel}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default EventActions;
