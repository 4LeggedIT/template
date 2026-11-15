import { describe, expect, it } from "vitest";
import { isInternalPath, safeContentUrl, safeMediaUrl } from "@/lib/safe-url";

describe("safeContentUrl", () => {
  it.each([
    "javascript:alert(1)",
    "JaVaScRiPt:alert(1)",
    "  javascript:alert(1)",
    "\u0001javascript:alert(1)",
    "java\tscript:alert(1)",
    "java\nscript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "vbscript:msgbox(1)",
    "//evil.com",
    "/\\evil.com",
    "\\\\evil.com",
    "",
    "   ",
  ])("rejects %j", (input) => {
    expect(safeContentUrl(input)).toBeUndefined();
  });

  it("rejects null and undefined", () => {
    expect(safeContentUrl(null)).toBeUndefined();
    expect(safeContentUrl(undefined)).toBeUndefined();
  });

  it.each(["https://example.org/a", "http://example.org", "mailto:a@b.org", "tel:+15555550100", "/contact", "#top", "/a?b=c#d"])(
    "allows %j",
    (input) => {
      expect(safeContentUrl(input)).toBe(input);
    },
  );
});

describe("isInternalPath", () => {
  it("accepts a same-site path and rejects protocol-relative or absolute values", () => {
    expect(isInternalPath("/about")).toBe(true);
    expect(isInternalPath("/")).toBe(true);
    expect(isInternalPath("//evil.example")).toBe(false);
    expect(isInternalPath("https://example.org")).toBe(false);
    expect(isInternalPath("#top")).toBe(false);
  });
});

describe("safeMediaUrl", () => {
  it("accepts what safeContentUrl accepts plus raster data:image URLs", () => {
    expect(safeMediaUrl("/a.webp")).toBe("/a.webp");
    expect(safeMediaUrl("https://example.org/a.png")).toBe("https://example.org/a.png");
    expect(safeMediaUrl("data:image/png;base64,iVBORw0KGgo=")).toBe("data:image/png;base64,iVBORw0KGgo=");
  });

  it.each([
    "javascript:alert(1)",
    "data:text/html;base64,PGI+",
    "data:image/svg+xml;base64,PHN2Zz4=",
    "data:image/png,<script>",
    "//evil.com",
    "",
    undefined,
  ])("rejects %j", (input) => {
    expect(safeMediaUrl(input as string | undefined)).toBeUndefined();
  });
});
