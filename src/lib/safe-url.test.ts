import { describe, expect, it } from "vitest";
import { safeContentUrl } from "@/lib/safe-url";

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
