/**
 * SHARED PATTERN: do not edit in a site repo.
 * Source: github.com/4LeggedIT/internal-tools
 *   4leggedit-websites/templates-sources/patterns/FlyerBuilderSection.specs.ts
 * Change it there, then sync it to every site.
 */
import type { FlyerSpec } from "./FlyerBuilderSection";

/**
 * Starter flyer types. Generic on purpose: no organization branding, no organization phone number. A site passes
 * one of these to `FlyerBuilderSection`, or spreads it to change wording or palette. Everything except the fixed
 * lines below comes from the person's input. Spanish wording is a first draft: have a fluent reviewer check it
 * before a site publishes it.
 */

/** Lost dog. Fixed lines follow the "Do Not Chase" guidance: tell people to report, not to chase. */
export const lostDogFlyerSpec: FlyerSpec = {
  id: "lost-dog",
  fileNamePrefix: "lost-dog-flyer",
  layout: { widthIn: 8.5, heightIn: 11, marginIn: 0.4, headerFrac: 0.19, footerFrac: 0.17, textMaxFrac: 0.26, photoMinFrac: 0.3 },
  palette: { band: "#c8102e", onBand: "#ffffff", paper: "#ffffff", ink: "#111111", frame: "#9a9a9a" },
  fixed: {
    en: { headerLines: ["LOST DOG", "DO NOT CHASE"], footerLabel: "Text or call with time and location seen" },
    es: { headerLines: ["PERRO PERDIDO", "NO LO PERSIGAS"], footerLabel: "Envía un texto o llama con la hora y el lugar" },
  },
  fields: [
    { key: "photo", kind: "image", slot: "photo", required: true },
    { key: "name", kind: "text", slot: "title", required: false, maxLength: 40 },
    { key: "description", kind: "multiline", slot: "body", required: false, maxLength: 300 },
    { key: "phone", kind: "phone", slot: "footerBig", required: true },
  ],
};

/** Found dog: someone has a dog that is not theirs and wants the owner to get in touch. */
export const foundDogFlyerSpec: FlyerSpec = {
  id: "found-dog",
  fileNamePrefix: "found-dog-flyer",
  layout: lostDogFlyerSpec.layout,
  palette: { band: "#0b5cad", onBand: "#ffffff", paper: "#ffffff", ink: "#111111", frame: "#9a9a9a" },
  fixed: {
    en: { headerLines: ["FOUND DOG"], footerLabel: "Is this your dog? Text or call" },
    es: { headerLines: ["PERRO ENCONTRADO"], footerLabel: "¿Es tu perro? Envía un texto o llama" },
  },
  fields: lostDogFlyerSpec.fields,
};
