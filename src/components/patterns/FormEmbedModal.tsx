import { useState, type ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon";

type FormEmbedModalProps = {
  formUrl: string;
  title: string;
  children?: ReactNode;
  triggerClassName?: string;
  triggerVariant?: ButtonVariant;
  triggerSize?: ButtonSize;
  asButton?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isOpen?: boolean;
  onClose?: () => void;
  labels?: {
    openInNewTab?: string;
    fallbackLink?: string;
    formDescription?: string;
  };
};

const FormEmbedModal = ({
  formUrl,
  title,
  children,
  triggerClassName,
  triggerVariant = "default",
  triggerSize = "default",
  asButton = true,
  open,
  onOpenChange,
  isOpen,
  onClose,
  labels = {},
}: FormEmbedModalProps) => {
  const { openInNewTab = "Open in new tab", fallbackLink, formDescription = "Complete the form below." } = labels;
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = typeof open === "boolean" && typeof onOpenChange === "function";
  const isLegacyControlled = typeof isOpen === "boolean";
  const resolvedOpen = isControlled ? open : isLegacyControlled ? isOpen : internalOpen;

  const setOpen = (next: boolean) => {
    if (isControlled && onOpenChange) {
      onOpenChange(next);
      return;
    }

    if (isLegacyControlled) {
      if (!next) onClose?.();
      return;
    }

    setInternalOpen(next);
    if (!next) onClose?.();
  };

  const onTriggerClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    setOpen(true);
  };

  const trigger = children ? (asButton ? (
      <Button variant={triggerVariant} size={triggerSize} className={triggerClassName} asChild>
        <a href={formUrl} target="_blank" rel="noopener noreferrer" onClick={onTriggerClick}>
          {children}
        </a>
      </Button>
    ) : (
      <a
        href={formUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn("cursor-pointer", triggerClassName)}
        onClick={onTriggerClick}
      >
        {children}
      </a>
    )) : null;

  const triggerWithFallback = trigger ? (
    fallbackLink ? (
      <div className="inline-flex flex-col items-start gap-1.5">
        {trigger}
        <a
          href={formUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          {fallbackLink}
        </a>
      </div>
    ) : trigger
  ) : null;

  return (
    <>
      {triggerWithFallback}
      <Dialog open={resolvedOpen} onOpenChange={setOpen}>
        <DialogContent className="h-[90vh] w-[95vw] max-w-4xl overflow-hidden p-0">
          <DialogHeader className="flex flex-row items-center justify-between gap-4 border-b bg-background px-5 py-4 pr-12">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="sr-only">{formDescription}</DialogDescription>
            <a
              href={formUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              {openInNewTab}
              <ExternalLink className="h-4 w-4" />
            </a>
          </DialogHeader>
          <div className="h-full min-h-0">
            <iframe
              src={formUrl}
              title={title}
              className="h-full min-h-[calc(90vh-84px)] w-full border-0"
              allow="geolocation; microphone; camera"
              allowFullScreen
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FormEmbedModal;
