import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type AccordionType = "single" | "multiple";
type AccordionValue = string | string[] | undefined;

type AccordionContextValue = {
  type: AccordionType;
  value: AccordionValue;
  setValue: (next: AccordionValue) => void;
  collapsible: boolean;
};

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const ctx = React.useContext(AccordionContext);
  if (!ctx) throw new Error("Accordion components must be used within <Accordion />");
  return ctx;
}

type AccordionProps = React.HTMLAttributes<HTMLDivElement> & {
  type?: AccordionType;
  collapsible?: boolean;
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[] | undefined) => void;
};

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      type = "single",
      collapsible = false,
      defaultValue,
      value: valueProp,
      onValueChange,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = React.useState<AccordionValue>(() => {
      if (valueProp !== undefined) return valueProp;
      return defaultValue;
    });

    const isControlled = valueProp !== undefined;
    const value = isControlled ? valueProp : uncontrolledValue;

    const setValue = React.useCallback(
      (next: AccordionValue) => {
        if (!isControlled) setUncontrolledValue(next);
        onValueChange?.(next);
      },
      [isControlled, onValueChange],
    );

    const ctx = React.useMemo<AccordionContextValue>(
      () => ({ type, value, setValue, collapsible }),
      [type, value, setValue, collapsible],
    );

    return (
      <AccordionContext.Provider value={ctx}>
        <div ref={ref} className={className} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  },
);
Accordion.displayName = "Accordion";

type AccordionItemProps = React.DetailsHTMLAttributes<HTMLDetailsElement> & {
  value: string;
};

const AccordionItem = React.forwardRef<HTMLDetailsElement, AccordionItemProps>(
  ({ className, value, onToggle, children, ...props }, ref) => {
    const { type, value: activeValue, setValue, collapsible } = useAccordionContext();

    const isOpen = React.useMemo(() => {
      if (type === "multiple") return Array.isArray(activeValue) && activeValue.includes(value);
      return activeValue === value;
    }, [activeValue, type, value]);

    return (
      <details
        ref={ref}
        open={Boolean(isOpen)}
        className={cn("group border-b", className)}
        onToggle={(event) => {
          const isTrusted = (event as unknown as { isTrusted?: boolean }).isTrusted ?? true;
          if (!isTrusted) {
            onToggle?.(event);
            return;
          }

          const detailsEl = event.currentTarget;
          const nextOpen = detailsEl.open;
          const stableEl =
            (detailsEl.querySelector("summary") as HTMLElement | null) ?? (detailsEl as unknown as HTMLElement);
          const prevTop = typeof window !== "undefined" ? stableEl.getBoundingClientRect().top : 0;
          const prevScrollY = typeof window !== "undefined" ? window.scrollY : 0;

          if (type === "multiple") {
            const current = Array.isArray(activeValue) ? activeValue : [];
            if (nextOpen) setValue([...new Set([...current, value])]);
            else setValue(current.filter((entry) => entry !== value));
          } else {
            if (nextOpen) setValue(value);
            else setValue(collapsible ? undefined : value);
          }

          if (typeof window !== "undefined") {
            requestAnimationFrame(() => {
              const nextTop = stableEl.getBoundingClientRect().top;
              const delta = nextTop - prevTop;
              if (delta !== 0) window.scrollTo({ top: prevScrollY + delta });
            });
          }

          onToggle?.(event);
        }}
        {...props}
      >
        {children}
      </details>
    );
  },
);
AccordionItem.displayName = "AccordionItem";

type AccordionTriggerProps = React.HTMLAttributes<HTMLElement> & {
  asChild?: never;
};

const AccordionTrigger = React.forwardRef<HTMLElement, AccordionTriggerProps>(
  ({ className, children, ...props }, ref) => (
    <summary
      ref={ref as React.Ref<HTMLElement>}
      className={cn(
        "flex cursor-pointer list-none items-center justify-between py-4 font-medium transition-colors hover:underline [&::-webkit-details-marker]:hidden",
        className,
      )}
      {...props}
    >
      <div className="flex-1">{children}</div>
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-180" />
    </summary>
  ),
);
AccordionTrigger.displayName = "AccordionTrigger";

type AccordionContentProps = React.HTMLAttributes<HTMLDivElement>;

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("pb-4 pt-0 text-sm", className)} {...props}>
      {children}
    </div>
  ),
);
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
