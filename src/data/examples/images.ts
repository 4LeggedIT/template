/** Local example images for every `/standards/*` page: one fixed photo per example dog, never hotlinked. Full frame, never cropped. */
import juniperSrc from "@/assets/examples/dog-juniper.webp";
import busterSrc from "@/assets/examples/dog-buster.webp";
import willowSrc from "@/assets/examples/dog-willow.webp";
import atlasSrc from "@/assets/examples/dog-atlas.webp";
import mapleSrc from "@/assets/examples/dog-maple.webp";
import rangerSrc from "@/assets/examples/dog-ranger.webp";
import poppySrc from "@/assets/examples/dog-poppy.webp";
import biscuitSrc from "@/assets/examples/dog-biscuit.webp";
import remiSrc from "@/assets/examples/dog-remi.webp";
import novaSrc from "@/assets/examples/dog-nova.webp";
import peachesSrc from "@/assets/examples/dog-peaches.webp";
import hudsonSrc from "@/assets/examples/dog-hudson.webp";
import cooperSrc from "@/assets/examples/dog-cooper.webp";
import dogPairSrc from "@/assets/examples/dog-pair.webp";
import groupWalkSrc from "@/assets/examples/group-walk.webp";
import suppliesBasketSrc from "@/assets/examples/supplies-basket.webp";
import missingFlyerSrc from "@/assets/examples/missing-flyer.svg";
import homeFlyerSrc from "@/assets/examples/home-flyer.svg";
import foundFlyerSrc from "@/assets/examples/found-flyer.svg";
import exampleLogoSrc from "@/assets/examples/example-logo.svg";
import rescueNetwork1LogoSrc from "@/assets/examples/logo-example-rescue-network-1.svg";
import rescueNetwork2LogoSrc from "@/assets/examples/logo-example-rescue-network-2.svg";
import veterinaryClinicLogoSrc from "@/assets/examples/logo-example-veterinary-clinic.svg";
import sandwichCoLogoSrc from "@/assets/examples/logo-example-sandwich-co.svg";
import fourLeggedItLogoSrc from "@/assets/4leggedit-logo.webp";

export const exampleImages = {
  juniper: juniperSrc,
  buster: busterSrc,
  willow: willowSrc,
  atlas: atlasSrc,
  maple: mapleSrc,
  ranger: rangerSrc,
  poppy: poppySrc,
  biscuit: biscuitSrc,
  remi: remiSrc,
  nova: novaSrc,
  peaches: peachesSrc,
  hudson: hudsonSrc,
  cooper: cooperSrc,
  dogPair: dogPairSrc,
  groupWalk: groupWalkSrc,
  suppliesBasket: suppliesBasketSrc,
  missingFlyer: missingFlyerSrc,
  homeFlyer: homeFlyerSrc,
  foundFlyer: foundFlyerSrc,
  exampleLogo: exampleLogoSrc,
  rescueNetwork1Logo: rescueNetwork1LogoSrc,
  rescueNetwork2Logo: rescueNetwork2LogoSrc,
  veterinaryClinicLogo: veterinaryClinicLogoSrc,
  sandwichCoLogo: sandwichCoLogoSrc,
  fourLeggedItLogo: fourLeggedItLogoSrc,
} as const;

export type ExampleImageKey = keyof typeof exampleImages;

/** Source file name per key, used when a snippet shows the matching import. */
export const exampleImageFiles: Record<ExampleImageKey, string> = {
  juniper: "dog-juniper.webp",
  buster: "dog-buster.webp",
  willow: "dog-willow.webp",
  atlas: "dog-atlas.webp",
  maple: "dog-maple.webp",
  ranger: "dog-ranger.webp",
  poppy: "dog-poppy.webp",
  biscuit: "dog-biscuit.webp",
  remi: "dog-remi.webp",
  nova: "dog-nova.webp",
  peaches: "dog-peaches.webp",
  hudson: "dog-hudson.webp",
  cooper: "dog-cooper.webp",
  dogPair: "dog-pair.webp",
  groupWalk: "group-walk.webp",
  suppliesBasket: "supplies-basket.webp",
  missingFlyer: "missing-flyer.svg",
  homeFlyer: "home-flyer.svg",
  foundFlyer: "found-flyer.svg",
  exampleLogo: "example-logo.svg",
  rescueNetwork1Logo: "logo-example-rescue-network-1.svg",
  rescueNetwork2Logo: "logo-example-rescue-network-2.svg",
  veterinaryClinicLogo: "logo-example-veterinary-clinic.svg",
  sandwichCoLogo: "logo-example-sandwich-co.svg",
  fourLeggedItLogo: "@/assets/4leggedit-logo.webp",
};
