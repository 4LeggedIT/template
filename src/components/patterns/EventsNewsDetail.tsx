import { Calendar, ExternalLink, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import EventActions from "@/components/patterns/EventActions";
import FormEmbedModal from "@/components/patterns/FormEmbedModal";
import {
  formatFallbackDateLabel,
  getEntryContentBlocks,
  getGoogleCalendarUrl,
  getMapsUrl,
  renderContentBlock,
  renderVideoEmbed,
  type EventsNewsEntry,
} from "@/components/patterns/EventsNewsSection";
import { cn } from "@/lib/utils";

export type EventsNewsDetailLabels = {
  backToIndex?: string;
  relatedNews?: string;
  register?: string;
  moreInfo?: string;
  openInMaps?: string;
  addToCalendar?: string;
  whatsapp?: string;
  facebook?: string;
  x?: string;
  email?: string;
  copyMessage?: string;
  share?: string;
  copied?: string;
  shared?: string;
  highlightsTitle?: string;
  detailsComingSoon?: string;
};

type EventsNewsDetailProps = {
  entry: EventsNewsEntry;
  backHref: string;
  relatedHref?: string;
  shareUrl?: string;
  /** Overrides the maps URL computed from the entry — use when a site needs richer location resolution than `getMapsUrl` provides. */
  mapsUrl?: string;
  /** Overrides the calendar URL computed from the entry — use when a site needs richer calendar details (e.g. timezone, highlights, a more-info link) than `getGoogleCalendarUrl` provides. */
  calendarUrl?: string;
  className?: string;
  labels?: EventsNewsDetailLabels;
};

const linkPattern = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;

const renderInlineText = (text: string) => {
  const nodes: Array<string | JSX.Element> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const regex = new RegExp(linkPattern.source, "g");

  while ((match = regex.exec(text))) {
    const [full, label, href] = match;
    const start = match.index;
    if (start > lastIndex) nodes.push(text.slice(lastIndex, start));
    nodes.push(
      <a
        key={`${href}-${start}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-primary hover:underline"
      >
        {label}
      </a>,
    );
    lastIndex = start + full.length;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
};

const renderBody = (body?: string) => {
  if (!body) return null;

  return body
    .split("\n\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph, idx) => {
      const lines = paragraph
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      const isList = lines.length > 1 && lines.every((line) => line.startsWith("- "));

      if (isList) {
        return (
          <ul key={idx} className="mt-4 list-disc space-y-1 pl-6 leading-relaxed text-muted-foreground">
            {lines.map((line, lineIdx) => (
              <li key={`${idx}-${lineIdx}`}>{renderInlineText(line.replace(/^- /, ""))}</li>
            ))}
          </ul>
        );
      }

      return (
        <p key={idx} className="mt-4 leading-relaxed text-muted-foreground">
          {renderInlineText(paragraph)}
        </p>
      );
    });
};

const renderImages = (entry: EventsNewsEntry) => {
  if (entry.images?.length) {
    return (
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entry.images.map((img, idx) => (
          <a key={`${img.src}-${idx}`} href={img.src} target="_blank" rel="noopener noreferrer" className="block">
            <img
              src={img.src}
              alt={img.alt ?? entry.title}
              className="max-h-[520px] w-full rounded-xl border border-border bg-background object-cover"
              loading="lazy"
            />
          </a>
        ))}
      </div>
    );
  }

  if (entry.imageSrc) {
    return (
      <a href={entry.imageSrc} target="_blank" rel="noopener noreferrer" className="mt-6 flex justify-center">
        <img
          src={entry.imageSrc}
          alt={entry.imageAlt ?? entry.title}
          className="max-h-[520px] max-w-full rounded-xl border border-border bg-background object-contain"
          loading="lazy"
        />
      </a>
    );
  }

  return null;
};

const EventsNewsDetail = ({
  entry,
  backHref,
  relatedHref,
  shareUrl,
  mapsUrl: mapsUrlOverride,
  calendarUrl: calendarUrlOverride,
  className,
  labels = {},
}: EventsNewsDetailProps) => {
  const resolvedLabels: Required<EventsNewsDetailLabels> = {
    backToIndex: labels.backToIndex ?? "Back",
    relatedNews: labels.relatedNews ?? "Read related news",
    register: labels.register ?? "Register",
    moreInfo: labels.moreInfo ?? "More info",
    openInMaps: labels.openInMaps ?? "Open in Maps",
    addToCalendar: labels.addToCalendar ?? "Add to Calendar",
    whatsapp: labels.whatsapp ?? "WhatsApp",
    facebook: labels.facebook ?? "Facebook",
    x: labels.x ?? "X",
    email: labels.email ?? "Email",
    copyMessage: labels.copyMessage ?? "Copy event",
    share: labels.share ?? "Share",
    copied: labels.copied ?? "Copied",
    shared: labels.shared ?? "Shared",
    highlightsTitle: labels.highlightsTitle ?? "Highlights",
    detailsComingSoon: labels.detailsComingSoon ?? "Full details coming soon.",
  };

  const isEvent = entry.kind === "event";
  const dateLabel = entry.dateLabel ?? formatFallbackDateLabel(entry);
  const mapsUrl = isEvent ? mapsUrlOverride ?? getMapsUrl(entry) : null;
  const calendarUrl = isEvent ? calendarUrlOverride ?? getGoogleCalendarUrl(entry) : null;
  const registrationUrl = isEvent ? entry.registrationUrl?.trim() : null;
  const moreInfoUrl = isEvent ? entry.moreInfoUrl?.trim() : null;
  const contentBlocks = entry.contentBlocks?.length
    ? getEntryContentBlocks(entry, resolvedLabels.highlightsTitle)
    : null;

  return (
    <Card className={cn("overflow-hidden border-border/80", className)}>
      <CardContent className="space-y-4 p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{dateLabel}</span>
          {isEvent && entry.locationLabel ? (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {entry.locationLabel}
            </span>
          ) : null}
        </div>

        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          {isEvent ? entry.calendarTitle ?? entry.title : entry.title}
        </h1>

        {relatedHref ? (
          <Link to={relatedHref} className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            {resolvedLabels.relatedNews}
          </Link>
        ) : null}

        {registrationUrl ? (
          <FormEmbedModal formUrl={registrationUrl} title={`${entry.title} Registration`} asButton={false}>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              {resolvedLabels.register}
              <ExternalLink className="h-3.5 w-3.5 opacity-70" />
            </span>
          </FormEmbedModal>
        ) : null}

        {moreInfoUrl ? (
          <a
            href={moreInfoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            {resolvedLabels.moreInfo}
            <ExternalLink className="h-3.5 w-3.5 opacity-70" />
          </a>
        ) : null}

        {isEvent && shareUrl ? (
          <EventActions
            url={shareUrl}
            title={entry.calendarTitle ?? entry.title}
            text={entry.summary}
            mapsUrl={mapsUrl ?? undefined}
            calendarUrl={calendarUrl ?? undefined}
            eventDetails={{ date: dateLabel, location: entry.locationLabel }}
            channels={["maps", "calendar", "whatsapp", "facebook", "copy-url", "copy-message"]}
            labels={{
              openInMaps: resolvedLabels.openInMaps,
              addToCalendar: resolvedLabels.addToCalendar,
              whatsapp: resolvedLabels.whatsapp,
              facebook: resolvedLabels.facebook,
              x: resolvedLabels.x,
              email: resolvedLabels.email,
              copyMessage: resolvedLabels.copyMessage,
              share: resolvedLabels.share,
              copied: resolvedLabels.copied,
              shared: resolvedLabels.shared,
            }}
          />
        ) : null}

        {entry.summary ? <p className="text-muted-foreground">{entry.summary}</p> : null}

        {contentBlocks ? (
          <div className="space-y-4">{contentBlocks.map((block, idx) => renderContentBlock(entry.id, block, idx))}</div>
        ) : (
          <>
            {entry.body ? renderBody(entry.body) : <p className="mt-4 italic text-muted-foreground">{resolvedLabels.detailsComingSoon}</p>}
            {entry.highlights?.length ? (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-foreground">{resolvedLabels.highlightsTitle}</p>
                <ul className="list-disc space-y-1 pl-6 text-sm text-muted-foreground">
                  {entry.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </>
        )}

        {entry.videoEmbed ? <div className="mt-6">{renderVideoEmbed(entry.videoEmbed, entry.title)}</div> : renderImages(entry)}

        <Link to={backHref} className="inline-block pt-2 text-sm font-semibold text-primary hover:underline">
          {resolvedLabels.backToIndex}
        </Link>
      </CardContent>
    </Card>
  );
};

export default EventsNewsDetail;
