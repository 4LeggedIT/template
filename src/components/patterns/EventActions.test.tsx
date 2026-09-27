import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import EventActions from "@/components/patterns/EventActions";

const base = {
  url: "https://example.org/events/paint-night",
  title: "Paint Night",
  mapsUrl: "https://maps.example.org/?q=hall",
  calendarUrl: "https://calendar.example.org/render",
  channels: ["maps", "calendar", "whatsapp", "facebook", "copy-url"] as const,
};

describe("EventActions", () => {
  it("renders registration as the first, filled button with the per-event label", () => {
    render(
      <EventActions
        {...base}
        channels={[...base.channels]}
        registration={{ url: "https://www.zeffy.com/embed/ticketing/paint-night", label: "Get tickets" }}
      />,
    );
    const tickets = screen.getByRole("link", { name: "Get tickets" });
    expect(tickets).toHaveAttribute("href", "https://www.zeffy.com/embed/ticketing/paint-night");
    const links = screen.getAllByRole("link");
    expect(links[0]).toBe(tickets);
    expect(tickets.className).not.toMatch(/border-input/);
  });

  it("falls back to labels.register when the event has no label of its own", () => {
    render(
      <EventActions
        {...base}
        channels={[...base.channels]}
        registration={{ url: "https://example.org/register" }}
        labels={{ register: "Inscribirse" }}
      />,
    );
    expect(screen.getByRole("link", { name: "Inscribirse" })).toBeInTheDocument();
  });

  it("puts share buttons on their own row under a heading, which an empty label hides", () => {
    const { container, rerender } = render(<EventActions {...base} channels={[...base.channels]} />);
    const rows = container.firstElementChild!.children;
    expect(rows).toHaveLength(2);
    expect(within(rows[0] as HTMLElement).getByRole("link", { name: /Open in Maps/ })).toBeInTheDocument();
    expect(within(rows[1] as HTMLElement).getByText("Share this event")).toBeInTheDocument();
    expect(within(rows[1] as HTMLElement).getByRole("link", { name: /WhatsApp/ })).toBeInTheDocument();

    rerender(<EventActions {...base} channels={[...base.channels]} labels={{ shareSection: "" }} />);
    expect(screen.queryByText("Share this event")).not.toBeInTheDocument();
  });

  it("renders no registration button without a registration prop", () => {
    render(<EventActions {...base} channels={[...base.channels]} />);
    expect(screen.queryByRole("link", { name: /Register/ })).not.toBeInTheDocument();
  });
});
