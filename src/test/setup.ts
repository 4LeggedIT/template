/**
 * SHARED TEST SETUP: do not edit in a site repo.
 * Source: github.com/4LeggedIT/internal-tools
 *   4leggedit-websites/templates-sources/test/setup.ts
 * Change it there, then sync it to every site.
 */
import "@testing-library/jest-dom";

// jsdom doesn't implement ResizeObserver; recharts' ResponsiveContainer (used by ImpactStatsSection
// and any future chart-based pattern) requires it to mount without throwing.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).ResizeObserver = ResizeObserverStub;

// jsdom doesn't implement IntersectionObserver either; embla-carousel tracks which slides are
// in view with it, so any carousel-based pattern (MediaCarouselSection) throws on mount without it.
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).IntersectionObserver = IntersectionObserverStub;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).IntersectionObserver = IntersectionObserverStub;

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
