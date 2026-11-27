import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FlyerBuilderSection, { type FlyerBuilderLabels } from "./FlyerBuilderSection";
import { lostDogFlyerSpec } from "./FlyerBuilderSection.specs";

const labels: FlyerBuilderLabels = {
  fields: {
    photo: { label: "Photo", hint: "A clear photo works best." },
    name: { label: "Name (optional)", note: "Leave the name off posters." },
    description: { label: "Description (optional)", example: "Example: Brown and white, medium size." },
    phone: { label: "Your phone number", hint: "A US number." },
  },
  photo: {
    choose: "Choose a photo",
    change: "Choose a different photo",
    privacy: "Your photo never leaves your device.",
    lowRes: "Small photo.",
    errors: { notImage: "Not a photo.", tooBig: "Too large.", unreadable: "Unreadable." },
  },
  description: { counter: "{{count}} of {{max}} characters", clipped: "Cut off." },
  phoneError: "Please enter a 10-digit US phone number.",
  warnings: { address: "Looks like a street address.", reward: "No rewards on posters." },
  previewTitle: "Preview",
  photoPlaceholder: "Your photo goes here",
  previewAlt: (name, phone) => (name ? `Preview for ${name}. Phone: ${phone}.` : `Preview. Phone: ${phone}.`),
  actions: { print: "Print flyer", download: "Download image", needMore: "Add a photo and a phone number.", working: "Preparing…", printError: "Could not print." },
};

const renderBuilder = () => render(<FlyerBuilderSection spec={lostDogFlyerSpec} locale="en" labels={labels} />);

describe("FlyerBuilderSection", () => {
  it("keeps Print and Download disabled until photo and phone are valid", () => {
    renderBuilder();
    expect(screen.getByLabelText(/Name \(optional\)/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Choose a photo" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Print flyer" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Download image" })).toBeDisabled();
    fireEvent.change(screen.getByLabelText(/Your phone number/), { target: { value: "9515438825" } });
    expect(screen.getByRole("button", { name: "Print flyer" })).toBeDisabled();
    expect(screen.getByText(labels.actions.needMore)).toBeInTheDocument();
  });

  it("shows the example below the field, not inside it", () => {
    renderBuilder();
    const description = screen.getByLabelText(/Description \(optional\)/) as HTMLTextAreaElement;
    expect(description.placeholder).toBe("");
    expect(screen.getByText(/^Example: Brown and white/)).toBeInTheDocument();
  });

  it("flags an invalid phone after blur and formats a valid one", () => {
    renderBuilder();
    const phone = screen.getByLabelText(/Your phone number/) as HTMLInputElement;
    fireEvent.change(phone, { target: { value: "12345" } });
    expect(screen.queryByRole("alert")).toBeNull();
    fireEvent.blur(phone);
    expect(screen.getByRole("alert")).toHaveTextContent(/10-digit/);
    expect(phone).toHaveAttribute("aria-invalid", "true");
    fireEvent.change(phone, { target: { value: "951-543-8825" } });
    fireEvent.blur(phone);
    expect(phone.value).toBe("(951) 543-8825");
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("warns about an address and a reward without blocking, and counts characters", () => {
    renderBuilder();
    const description = screen.getByLabelText(/Description \(optional\)/) as HTMLTextAreaElement;
    expect(description.maxLength).toBe(300);
    fireEvent.change(description, { target: { value: "Lives at 1234 Elm St. $200 reward" } });
    expect(screen.getByText(labels.warnings.address)).toBeInTheDocument();
    expect(screen.getByText(labels.warnings.reward)).toBeInTheDocument();
    fireEvent.change(description, { target: { value: "abc" } });
    expect(screen.queryByText(labels.warnings.address)).toBeNull();
    expect(screen.getByText("3 of 300 characters")).toBeInTheDocument();
  });

  it("describes the preview for screen readers, with the name when given", () => {
    renderBuilder();
    fireEvent.change(screen.getByLabelText(/Name \(optional\)/), { target: { value: "Max" } });
    fireEvent.change(screen.getByLabelText(/Your phone number/), { target: { value: "9515438825" } });
    expect(screen.getByRole("img")).toHaveAttribute("aria-label", expect.stringContaining("for Max"));
    expect(screen.getByRole("img")).toHaveAttribute("aria-label", expect.stringContaining("(951) 543-8825"));
  });

  it("limits the file picker to images", () => {
    const { container } = renderBuilder();
    expect((container.querySelector('input[type="file"]') as HTMLInputElement).accept).toBe("image/*");
  });

  it("renders the no-JavaScript fallback links only when given", () => {
    const { container, rerender } = renderBuilder();
    expect(container.querySelector("noscript")).toBeNull();
    rerender(
      <FlyerBuilderSection
        spec={lostDogFlyerSpec}
        locale="en"
        labels={labels}
        noScript={{ message: "Needs JavaScript.", links: [{ href: "/blank-en.pdf", label: "Blank flyer (PDF)", lang: "en" }] }}
      />,
    );
    expect(container.querySelector("noscript")).not.toBeNull();
  });
});
