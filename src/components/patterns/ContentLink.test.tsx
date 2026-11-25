import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import ContentLink from "@/components/patterns/ContentLink";

const renderLink = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe("ContentLink", () => {
  it("renders a router link for a same-site path", () => {
    renderLink(<ContentLink href="/about">About</ContentLink>);
    const link = screen.getByRole("link", { name: "About" });
    expect(link).toHaveAttribute("href", "/about");
    expect(link).not.toHaveAttribute("target");
  });

  it("renders a new-tab anchor for an https URL", () => {
    renderLink(<ContentLink href="https://example.org/x">Out</ContentLink>);
    const link = screen.getByRole("link", { name: "Out" });
    expect(link).toHaveAttribute("href", "https://example.org/x");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it.each(["javascript:alert(1)", " JaVaScRiPt:alert(1)", "java\tscript:alert(1)", "vbscript:msgbox(1)", "data:text/html,<b>x</b>", "//evil.example", "/\\evil.example"])(
    "renders no link for %j",
    (href) => {
      for (const external of [undefined, true, false]) {
        const { container, unmount } = renderLink(<ContentLink href={href} external={external}>Nope</ContentLink>);
        expect(container.querySelector("a")).toBeNull();
        expect(container).toBeEmptyDOMElement();
        unmount();
      }
    },
  );

  it("treats //host as off-site, not as a same-site path", () => {
    const { container } = renderLink(<ContentLink href="//evil.example/x">Nope</ContentLink>);
    expect(container.querySelector("a")).toBeNull();
  });

  it("renders the children unlinked when asked to", () => {
    renderLink(
      <ContentLink href="javascript:alert(1)" whenUnsafe="children">
        <img src="/a.webp" alt="Photo" />
      </ContentLink>,
    );
    expect(screen.getByAltText("Photo")).toBeInTheDocument();
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("accepts an inlined raster data URL only when imageLink is set", () => {
    const png = "data:image/png;base64,iVBORw0KGgo=";
    const media = renderLink(<ContentLink href={png} external imageLink>Img</ContentLink>);
    expect(media.container.querySelector("a")).toHaveAttribute("href", png);
    media.unmount();
    const plain = renderLink(<ContentLink href={png} external>Img</ContentLink>);
    expect(plain.container.querySelector("a")).toBeNull();
    plain.unmount();
    const svg = renderLink(<ContentLink href="data:image/svg+xml;base64,PHN2Zz4=" external imageLink>Img</ContentLink>);
    expect(svg.container.querySelector("a")).toBeNull();
    svg.unmount();
    const html = renderLink(<ContentLink href="data:text/html;base64,PGI+" external imageLink>Img</ContentLink>);
    expect(html.container.querySelector("a")).toBeNull();
  });
});
