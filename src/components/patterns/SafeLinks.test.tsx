import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import ImpactStatsSection from "@/components/patterns/ImpactStatsSection";
import SocialFollowCta from "@/components/patterns/SocialFollowCta";
import PlacementHelpSection from "@/components/patterns/PlacementHelpSection";
import SpendBreakdownSection from "@/components/patterns/SpendBreakdownSection";
import MediaStripSection from "@/components/patterns/MediaStripSection";
import DogSpotlightSection from "@/components/patterns/DogSpotlightSection";
import SuccessStoriesSection from "@/components/patterns/SuccessStoriesSection";
import HomeHighlightSection from "@/components/patterns/HomeHighlightSection";
import NewsTeaserSection from "@/components/patterns/NewsTeaserSection";
import PageHero from "@/components/patterns/PageHero";

// TPL-062: every shared pattern that renders a props-authored URL must go through
// ContentLink/safeContentUrl, so an executable-scheme value never reaches an href.
// One representative per component family; the value is deliberately hostile.
const BAD = "javascript:alert(document.domain)";

const hrefs = (container: HTMLElement) =>
  Array.from(container.querySelectorAll("a")).map((a) => a.getAttribute("href") ?? "");

const renderIn = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);

const expectNoUnsafeHref = (container: HTMLElement) => {
  expect(container.innerHTML.toLowerCase()).not.toContain("javascript:");
  expect(hrefs(container).filter((h) => /^\s*(javascript|vbscript|data):/i.test(h))).toEqual([]);
};

describe("shared patterns do not render unsafe URL props as links", () => {
  it("ImpactStatsSection (stat.href, ctaHref)", () => {
    const { container } = renderIn(
      <ImpactStatsSection lifetimeStats={[{ id: "s", value: 5, label: "Dogs", href: BAD }]} ctaHref={BAD} ctaLabel="See more" />,
    );
    expect(container.textContent).toContain("Dogs");
    expect(container.querySelector("a")).toBeNull();
    expectNoUnsafeHref(container);
  });

  it("SocialFollowCta", () => {
    const { container } = renderIn(
      <SocialFollowCta title="Follow" links={[{ id: "a", label: "A", href: BAD }, { id: "b", label: "B", href: BAD, external: true }]} />,
    );
    expect(container.querySelector("a")).toBeNull();
    expectNoUnsafeHref(container);
  });

  it("PlacementHelpSection (primaryCta, secondaryCta)", () => {
    const { container } = renderIn(
      <PlacementHelpSection
        listings={[]}
        primaryCta={{ label: "P", href: BAD, external: true }}
        secondaryCta={{ label: "S", href: BAD }}
      />,
    );
    expect(container.querySelector("a")).toBeNull();
    expectNoUnsafeHref(container);
  });

  it("SpendBreakdownSection (sourceHref)", () => {
    const { container } = renderIn(
      <SpendBreakdownSection
        categories={[{ id: "c", label: "Vet", amount: 100 }] as never}
        periodLabel="FY2025"
        sourceHref={BAD}
        labels={{ sourceLabel: "Source" } as never}
      />,
    );
    expect(container.querySelector("a")).toBeNull();
    expectNoUnsafeHref(container);
  });

  it("MediaStripSection (link item)", () => {
    const { container } = renderIn(
      <MediaStripSection items={[{ id: "l", kind: "link", href: BAD, title: "Clip", thumbnailSrc: "/t.webp" }]} />,
    );
    expect(container.textContent).toContain("Clip");
    expect(container.querySelector("a")).toBeNull();
    expectNoUnsafeHref(container);
  });

  it("DogSpotlightSection (detailsUrl)", () => {
    const { container } = renderIn(
      <DogSpotlightSection dogs={[{ id: "d", name: "Rex", detailsUrl: BAD } as never]} />,
    );
    expect(container.textContent).toContain("Rex");
    expect(container.querySelector("a")).toBeNull();
    expectNoUnsafeHref(container);
  });

  it("SuccessStoriesSection (storyHref, ctaLinks)", () => {
    const { container } = renderIn(
      <SuccessStoriesSection
        stories={[
          {
            id: "s",
            name: "Rex",
            imageSrc: "/rex.webp",
            storyHref: BAD,
            ctaLinks: [{ label: "A", href: BAD, external: true }, { label: "B", href: BAD }],
          } as never,
        ]}
      />,
    );
    expect(container.textContent).toContain("Rex");
    expect(container.querySelector("a")).toBeNull();
    expectNoUnsafeHref(container);
  });

  it("HomeHighlightSection, NewsTeaserSection and PageHero breadcrumbs", () => {
    const home = renderIn(
      <HomeHighlightSection
        items={[{ id: "h", title: "T", badgeLabel: "B", href: BAD } as never]}
      />,
    );
    expectNoUnsafeHref(home.container);
    const teaser = renderIn(
      <NewsTeaserSection
        viewAllHref={BAD}
        viewAllLabel="All"
        entries={[{ id: "f", title: "F", href: BAD, dateLabel: "x" }, { id: "g", title: "G", href: BAD }]}
      />,
    );
    expectNoUnsafeHref(teaser.container);
    const hero = renderIn(
      <PageHero title="Hi" breadcrumbs={[{ label: "Home", href: BAD }, { label: "Here" }]} />,
    );
    expectNoUnsafeHref(hero.container);
  });
});
