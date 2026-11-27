/**
 * SHARED PATTERN: do not edit in a site repo.
 * Source: github.com/4LeggedIT/internal-tools
 *   4leggedit-websites/templates-sources/patterns/FlyerBuilderSection.tsx
 * Change it there, then sync it to every site.
 */
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ContentLink from "./ContentLink";
import {
  canvasHeightFor,
  detectWarnings,
  downloadCanvas,
  fileNameFor,
  loadFlyerFonts,
  loadPhoto,
  parseUsPhone,
  PhotoError,
  printCanvas,
  renderFlyer,
  renderPrintCanvas,
} from "./FlyerBuilderSection.helpers";

/**
 * Generic simple-flyer builder. A flyer TYPE is a `FlyerSpec` (data): fixed wording per language, the inputs a
 * person fills in, and the page geometry. The renderer draws any spec the same way: a header band with fixed
 * lines, one photo slot, a stack of text fields, and a footer band with a label and one big line (a phone number).
 * The pattern knows nothing about any one organization; the site passes the spec and every visible string.
 * Starter specs live in `FlyerBuilderSection.specs.ts`. Everything runs in the browser; nothing is uploaded.
 */

export type FlyerLocale = "en" | "es";

export type FlyerFieldKind = "image" | "text" | "multiline" | "phone";

/** Where a field is drawn on the flyer. */
export type FlyerSlot = "photo" | "title" | "body" | "footerBig";

export interface FlyerField {
  /** Key in the values object. */
  key: string;
  kind: FlyerFieldKind;
  slot: FlyerSlot;
  required: boolean;
  /** Maximum characters for text kinds (ignored for image and phone). */
  maxLength?: number;
}

export interface FlyerPalette {
  /** Header and footer bands. */
  band: string;
  /** Text on the bands. */
  onBand: string;
  /** Page background. */
  paper: string;
  /** Text on the page. */
  ink: string;
  /** Hairline frame around the photo. */
  frame: string;
}

export interface FlyerLayout {
  /** Page size in inches. */
  widthIn: number;
  heightIn: number;
  /** Safe printer margin in inches. */
  marginIn: number;
  /** Header band height as a fraction of the page height. */
  headerFrac: number;
  /** Footer band height as a fraction of the page height. */
  footerFrac: number;
  /** Largest share of the page height the text stack (title plus body) may take. */
  textMaxFrac: number;
  /** Smallest share of the page height the photo slot keeps. */
  photoMinFrac: number;
}

export interface FlyerFixedText {
  /** Header lines, drawn top to bottom, each fitted to the band width. */
  headerLines: string[];
  /** Small line above the footer's big text. */
  footerLabel: string;
}

export interface FlyerSpec {
  id: string;
  layout: FlyerLayout;
  palette: FlyerPalette;
  fixed: Record<FlyerLocale, FlyerFixedText>;
  fields: FlyerField[];
  /** Download file name stem, e.g. "lost-dog-flyer" gives "lost-dog-flyer-max.png". Defaults to `<id>-flyer`. */
  fileNamePrefix?: string;
}

/** What the person typed. Text kinds hold strings; the image kind is held separately as `FlyerPhoto`. */
export type FlyerValues = Record<string, string>;

/** A decoded photo, already oriented and downscaled, ready to draw. */
export interface FlyerPhoto {
  source: CanvasImageSource;
  width: number;
  height: number;
  /** True when the original was small enough that a full-page print may look soft. */
  lowRes?: boolean;
}

/** The two things the renderer asks of a canvas context, so tests can supply a fake. */
export type MeasureText = (text: string, font: string) => number;

export type PhotoErrorCode = "notImage" | "tooBig" | "unreadable";

export type FlyerWarning = "address" | "reward";

export interface FlyerFieldLabels {
  label: string;
  hint?: string;
  note?: string;
  /** Example text shown below the field (never inside it). */
  example?: string;
}

export interface FlyerBuilderLabels {
  fields: Record<string, FlyerFieldLabels>;
  photo: {
    choose: string;
    change: string;
    privacy: string;
    lowRes: string;
    errors: Record<PhotoErrorCode, string>;
  };
  description: { counter: string; clipped: string };
  phoneError: string;
  warnings: Record<FlyerWarning, string>;
  previewTitle: string;
  photoPlaceholder: string;
  previewAlt: (name: string, phone: string) => string;
  actions: { print: string; download: string; needMore: string; working: string; printError: string };
}

export interface FlyerBuilderNoScript {
  message: string;
  /** Blank printable versions to offer when JavaScript is off (for example a PDF per language). */
  links: { href: string; label: string; lang?: string }[];
}

export interface FlyerBuilderSectionProps {
  spec: FlyerSpec;
  locale: FlyerLocale;
  labels: FlyerBuilderLabels;
  /** Same-origin woff2 for the heavy headline face. Omit to use the system fallback (Impact / Arial Narrow). */
  headlineFontUrl?: string;
  /** Shown inside `<noscript>`; omit for no fallback. */
  noScript?: FlyerBuilderNoScript;
}

const PREVIEW_PIXEL_WIDTH = 1020;

const FlyerBuilderSection = ({ spec, locale, labels, headlineFontUrl, noScript }: FlyerBuilderSectionProps) => {
  const uid = useId();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [values, setValues] = useState<FlyerValues>({});
  const [photo, setPhoto] = useState<FlyerPhoto | null>(null);
  const [photoError, setPhotoError] = useState<PhotoErrorCode | null>(null);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);
  const [bodyClipped, setBodyClipped] = useState(false);
  const [busy, setBusy] = useState<"print" | "download" | null>(null);
  const [actionError, setActionError] = useState(false);

  const photoField = spec.fields.find((f) => f.kind === "image");
  const phoneField = spec.fields.find((f) => f.kind === "phone");
  const titleField = spec.fields.find((f) => f.slot === "title");
  const textFields = spec.fields.filter((f) => f.kind === "text" || f.kind === "multiline");

  useEffect(() => {
    let alive = true;
    loadFlyerFonts(headlineFontUrl).then(() => alive && setFontsReady(true));
    return () => {
      alive = false;
    };
  }, [headlineFontUrl]);

  const setValue = (key: string, value: string) => setValues((v) => ({ ...v, [key]: value }));

  const phoneValue = phoneField ? (values[phoneField.key] ?? "") : "";
  const phone = useMemo(() => parseUsPhone(phoneValue), [phoneValue]);
  const phoneInvalid = Boolean(phoneField && phoneValue.trim() && !phone.valid);
  const ready = Boolean(photo) && (!phoneField || phone.valid);

  // Live preview. Redraws when anything changes; fonts trigger one more draw when they arrive.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handle = window.requestAnimationFrame(() => {
      canvas.width = PREVIEW_PIXEL_WIDTH;
      canvas.height = canvasHeightFor(spec, PREVIEW_PIXEL_WIDTH);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const report = renderFlyer(ctx, spec, values, locale, photo, {
        pixelWidth: PREVIEW_PIXEL_WIDTH,
        photoPlaceholder: labels.photoPlaceholder,
      });
      setBodyClipped(report.bodyClipped);
    });
    return () => window.cancelAnimationFrame(handle);
  }, [spec, values, locale, photo, fontsReady, labels.photoPlaceholder]);

  const onPhotoChange = useCallback(async (file: File | undefined) => {
    if (!file) return;
    setPhotoError(null);
    try {
      setPhoto(await loadPhoto(file));
    } catch (error) {
      setPhotoError(error instanceof PhotoError ? error.code : "unreadable");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  }, []);

  const nameValue = titleField ? (values[titleField.key] ?? "") : "";

  const run = async (kind: "print" | "download") => {
    if (!ready) return;
    setBusy(kind);
    setActionError(false);
    try {
      await loadFlyerFonts(headlineFontUrl);
      const canvas = renderPrintCanvas(spec, values, locale, photo);
      if (kind === "download") await downloadCanvas(canvas, fileNameFor(nameValue, spec.fileNamePrefix ?? `${spec.id}-flyer`));
      else await printCanvas(canvas, spec.layout.widthIn, spec.layout.heightIn, nameValue || spec.id);
    } catch {
      setActionError(true);
    } finally {
      setBusy(null);
    }
  };

  const previewAlt = labels.previewAlt(nameValue.trim(), phone.valid ? phone.formatted : "");
  const photoLabels = photoField ? labels.fields[photoField.key] : undefined;

  return (
    <>
      {noScript && (
        <noscript>
          <p>{noScript.message}</p>
          <ul>
            {noScript.links.map((link) => (
              <li key={link.href} lang={link.lang}>
                <ContentLink href={link.href} external>
                  {link.label}
                </ContentLink>
              </li>
            ))}
          </ul>
        </noscript>
      )}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-start">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()} noValidate>
          {photoField && photoLabels && (
            <div className="space-y-2">
              <p className="text-base font-medium leading-none">
                {photoLabels.label} <span aria-hidden="true">*</span>
              </p>
              <p id={`${uid}-photo-hint`} className="text-sm text-muted-foreground">
                {photoLabels.hint}
              </p>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="sr-only"
                tabIndex={-1}
                aria-hidden="true"
                onChange={(e) => void onPhotoChange(e.target.files?.[0])}
              />
              <Button
                type="button"
                variant="outline"
                className="min-h-11"
                aria-describedby={`${uid}-photo-hint ${uid}-photo-privacy`}
                onClick={() => fileRef.current?.click()}
              >
                {photo ? labels.photo.change : labels.photo.choose}
              </Button>
              <p id={`${uid}-photo-privacy`} className="text-sm text-muted-foreground">
                {labels.photo.privacy}
              </p>
              {photoError && (
                <p role="alert" className="text-sm font-medium text-destructive">
                  {labels.photo.errors[photoError]}
                </p>
              )}
              {photo?.lowRes && (
                <p role="status" className="text-sm text-muted-foreground">
                  {labels.photo.lowRes}
                </p>
              )}
            </div>
          )}

          {textFields.map((field) => {
            const l = labels.fields[field.key];
            if (!l) return null;
            const value = values[field.key] ?? "";
            const warnings = field.kind === "multiline" ? detectWarnings(value) : [];
            const common = {
              id: `${uid}-${field.key}`,
              value,
              maxLength: field.maxLength,
              onChange: (e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) => setValue(field.key, e.target.value),
              "aria-describedby": [l.note ? `${uid}-${field.key}-note` : "", l.example ? `${uid}-${field.key}-example` : "", field.maxLength && field.kind === "multiline" ? `${uid}-${field.key}-count` : ""]
                .filter(Boolean)
                .join(" ") || undefined,
            };
            return (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={common.id} className="text-base">
                  {l.label}
                </Label>
                {field.kind === "multiline" ? <Textarea {...common} rows={5} className="text-base" /> : <Input {...common} autoComplete="off" />}
                {l.note && (
                  <p id={`${uid}-${field.key}-note`} className="text-sm text-muted-foreground">
                    {l.note}
                  </p>
                )}
                {l.example && (
                  <p id={`${uid}-${field.key}-example`} className="text-sm text-muted-foreground">
                    {l.example}
                  </p>
                )}
                {field.kind === "multiline" && field.maxLength && (
                  <p id={`${uid}-${field.key}-count`} className="text-sm text-muted-foreground">
                    {labels.description.counter.replace("{{count}}", String(value.length)).replace("{{max}}", String(field.maxLength))}
                  </p>
                )}
                {warnings.map((w) => (
                  <p key={w} role="status" className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-950">
                    {labels.warnings[w]}
                  </p>
                ))}
                {field.kind === "multiline" && bodyClipped && (
                  <p role="status" className="text-sm font-medium text-destructive">
                    {labels.description.clipped}
                  </p>
                )}
              </div>
            );
          })}

          {phoneField && labels.fields[phoneField.key] && (
            <div className="space-y-2">
              <Label htmlFor={`${uid}-phone`} className="text-base">
                {labels.fields[phoneField.key].label} <span aria-hidden="true">*</span>
              </Label>
              <Input
                id={`${uid}-phone`}
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                value={phoneValue}
                maxLength={20}
                aria-invalid={phoneInvalid && phoneTouched ? true : undefined}
                aria-describedby={`${uid}-phone-hint${phoneInvalid && phoneTouched ? ` ${uid}-phone-error` : ""}`}
                onChange={(e) => setValue(phoneField.key, e.target.value)}
                onBlur={() => {
                  setPhoneTouched(true);
                  if (phone.valid) setValue(phoneField.key, phone.formatted);
                }}
              />
              <p id={`${uid}-phone-hint`} className="text-sm text-muted-foreground">
                {labels.fields[phoneField.key].hint}
              </p>
              {phoneInvalid && phoneTouched && (
                <p id={`${uid}-phone-error`} role="alert" className="text-sm font-medium text-destructive">
                  {labels.phoneError}
                </p>
              )}
            </div>
          )}
        </form>

        <section aria-label={labels.previewTitle} className="space-y-4">
          <h2 className="text-xl font-semibold">{labels.previewTitle}</h2>
          <canvas
            ref={canvasRef}
            role="img"
            aria-label={previewAlt}
            className="block h-auto w-full max-w-[26rem] rounded-md border bg-white shadow-sm"
            style={{ aspectRatio: `${spec.layout.widthIn} / ${spec.layout.heightIn}` }}
          />
          <div className="flex flex-wrap gap-3">
            <Button type="button" className="min-h-11" disabled={!ready || busy !== null} onClick={() => void run("print")}>
              {busy === "print" ? labels.actions.working : labels.actions.print}
            </Button>
            <Button type="button" variant="outline" className="min-h-11" disabled={!ready || busy !== null} onClick={() => void run("download")}>
              {busy === "download" ? labels.actions.working : labels.actions.download}
            </Button>
          </div>
          {!ready && <p className="text-sm text-muted-foreground">{labels.actions.needMore}</p>}
          {actionError && (
            <p role="alert" className="text-sm font-medium text-destructive">
              {labels.actions.printError}
            </p>
          )}
        </section>
      </div>
    </>
  );
};

export default FlyerBuilderSection;
