import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AdoptAPetEmbed from "@/components/patterns/AdoptAPetEmbed";
import { patternCspRequirements } from "../../../tools/csp-registry.mjs";

const renderSrcDoc = () => {
  const { container } = render(
    <AdoptAPetEmbed listingsUrl="https://www.adoptapet.com/shelter/74343-example" shelterId="74343" scrollerWidth={450} scrollerHeight={320} />,
  );
  return container.querySelector("iframe")?.getAttribute("srcdoc") ?? "";
};

describe("AdoptAPetEmbed CSP contract", () => {
  it("renders exactly one inline script and it is static (no per-site values)", () => {
    const srcDoc = renderSrcDoc();
    const inline = [...srcDoc.matchAll(/<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g)];
    expect(inline).toHaveLength(1);
    expect(inline[0][1]).not.toMatch(/74343|450|320/);
    expect(srcDoc).toContain('data-id="74343"');
  });

  it("the inline script's sha256 is registered in csp-registry.mjs", async () => {
    const srcDoc = renderSrcDoc();
    const body = [...srcDoc.matchAll(/<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g)][0][1];
    const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(body)));
    const hash = `'sha256-${btoa(String.fromCharCode(...digest))}'`;
    expect(patternCspRequirements.AdoptAPetEmbed.scriptSrc).toContain(hash);
  });
});
