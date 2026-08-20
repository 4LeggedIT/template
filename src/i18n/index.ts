import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from "@/locales/en/common.json";
import enHome from "@/locales/en/home.json";
import enErrors from "@/locales/en/errors.json";
import enStandardsHome from "@/locales/en/standardsHome.json";
import enBuildValidation from "@/locales/en/buildValidation.json";
import enCiBuild from "@/locales/en/ciBuild.json";
import enNoJsFallbacks from "@/locales/en/noJsFallbacks.json";
import enAdoptablePets from "@/locales/en/adoptablePets.json";
import enAdoptablePetsAdoptAPet from "@/locales/en/adoptablePetsAdoptAPet.json";
import enAdoptablePetsGetBuddy from "@/locales/en/adoptablePetsGetBuddy.json";
import enAdoptablePetsHybrid from "@/locales/en/adoptablePetsHybrid.json";
import enAdoptablePetsLocal from "@/locales/en/adoptablePetsLocal.json";
import enAdoptablePetsPetfinder from "@/locales/en/adoptablePetsPetfinder.json";
import enPawPlacer from "@/locales/en/pawPlacer.json";
import enDogSpotlight from "@/locales/en/dogSpotlight.json";
import enEventsNews from "@/locales/en/eventsNews.json";
import enJourneyTimeline from "@/locales/en/journeyTimeline.json";
import enSuccessStories from "@/locales/en/successStories.json";
import enTestimonials from "@/locales/en/testimonials.json";
import enFlyerLibrary from "@/locales/en/flyerLibrary.json";
import enMediaGallery from "@/locales/en/mediaGallery.json";
import enFaqDisclosure from "@/locales/en/faqDisclosure.json";
import enNewsHighlight from "@/locales/en/newsHighlight.json";
import enFormEmbedModal from "@/locales/en/formEmbedModal.json";
import enPaypalDonate from "@/locales/en/paypalDonate.json";
import enZeffyDonate from "@/locales/en/zeffyDonate.json";
import enCommunityPartners from "@/locales/en/communityPartners.json";
import enSupporterRecognition from "@/locales/en/supporterRecognition.json";
import enImpactStats from "@/locales/en/impactStats.json";
import enSpendBreakdown from "@/locales/en/spendBreakdown.json";
import enImpactAccountability from "@/locales/en/impactAccountability.json";
import enKennelDisplayTools from "@/locales/en/kennelDisplayTools.json";
import enDocuments from "@/locales/en/documents.json";
import enFound from "@/locales/en/found.json";
import enPlacementHelp from "@/locales/en/placementHelp.json";
import enBlog from "@/locales/en/blog.json";

import esCommon from "@/locales/es/common.json";
import esHome from "@/locales/es/home.json";
import esErrors from "@/locales/es/errors.json";
import esStandardsHome from "@/locales/es/standardsHome.json";
import esBuildValidation from "@/locales/es/buildValidation.json";
import esCiBuild from "@/locales/es/ciBuild.json";
import esNoJsFallbacks from "@/locales/es/noJsFallbacks.json";
import esAdoptablePets from "@/locales/es/adoptablePets.json";
import esAdoptablePetsAdoptAPet from "@/locales/es/adoptablePetsAdoptAPet.json";
import esAdoptablePetsGetBuddy from "@/locales/es/adoptablePetsGetBuddy.json";
import esAdoptablePetsHybrid from "@/locales/es/adoptablePetsHybrid.json";
import esAdoptablePetsLocal from "@/locales/es/adoptablePetsLocal.json";
import esAdoptablePetsPetfinder from "@/locales/es/adoptablePetsPetfinder.json";
import esPawPlacer from "@/locales/es/pawPlacer.json";
import esDogSpotlight from "@/locales/es/dogSpotlight.json";
import esEventsNews from "@/locales/es/eventsNews.json";
import esJourneyTimeline from "@/locales/es/journeyTimeline.json";
import esSuccessStories from "@/locales/es/successStories.json";
import esTestimonials from "@/locales/es/testimonials.json";
import esFlyerLibrary from "@/locales/es/flyerLibrary.json";
import esMediaGallery from "@/locales/es/mediaGallery.json";
import esFaqDisclosure from "@/locales/es/faqDisclosure.json";
import esNewsHighlight from "@/locales/es/newsHighlight.json";
import esFormEmbedModal from "@/locales/es/formEmbedModal.json";
import esPaypalDonate from "@/locales/es/paypalDonate.json";
import esZeffyDonate from "@/locales/es/zeffyDonate.json";
import esCommunityPartners from "@/locales/es/communityPartners.json";
import esSupporterRecognition from "@/locales/es/supporterRecognition.json";
import esImpactStats from "@/locales/es/impactStats.json";
import esSpendBreakdown from "@/locales/es/spendBreakdown.json";
import esImpactAccountability from "@/locales/es/impactAccountability.json";
import esKennelDisplayTools from "@/locales/es/kennelDisplayTools.json";
import esDocuments from "@/locales/es/documents.json";
import esFound from "@/locales/es/found.json";
import esPlacementHelp from "@/locales/es/placementHelp.json";
import esBlog from "@/locales/es/blog.json";

const isBrowser = typeof window !== "undefined";
const savedLanguage = isBrowser ? (localStorage.getItem("language") ?? "en") : "en";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: enCommon,
      home: enHome,
      errors: enErrors,
      standardsHome: enStandardsHome,
      buildValidation: enBuildValidation,
      ciBuild: enCiBuild,
      noJsFallbacks: enNoJsFallbacks,
      adoptablePets: enAdoptablePets,
      adoptablePetsAdoptAPet: enAdoptablePetsAdoptAPet,
      adoptablePetsGetBuddy: enAdoptablePetsGetBuddy,
      adoptablePetsHybrid: enAdoptablePetsHybrid,
      adoptablePetsLocal: enAdoptablePetsLocal,
      adoptablePetsPetfinder: enAdoptablePetsPetfinder,
      pawPlacer: enPawPlacer,
      dogSpotlight: enDogSpotlight,
      eventsNews: enEventsNews,
      journeyTimeline: enJourneyTimeline,
      successStories: enSuccessStories,
      testimonials: enTestimonials,
      flyerLibrary: enFlyerLibrary,
      mediaGallery: enMediaGallery,
      faqDisclosure: enFaqDisclosure,
      newsHighlight: enNewsHighlight,
      formEmbedModal: enFormEmbedModal,
      paypalDonate: enPaypalDonate,
      zeffyDonate: enZeffyDonate,
      communityPartners: enCommunityPartners,
      supporterRecognition: enSupporterRecognition,
      impactStats: enImpactStats,
      spendBreakdown: enSpendBreakdown,
      impactAccountability: enImpactAccountability,
      kennelDisplayTools: enKennelDisplayTools,
      documents: enDocuments,
      found: enFound,
      placementHelp: enPlacementHelp,
      blog: enBlog,
    },
    es: {
      common: esCommon,
      home: esHome,
      errors: esErrors,
      standardsHome: esStandardsHome,
      buildValidation: esBuildValidation,
      ciBuild: esCiBuild,
      noJsFallbacks: esNoJsFallbacks,
      adoptablePets: esAdoptablePets,
      adoptablePetsAdoptAPet: esAdoptablePetsAdoptAPet,
      adoptablePetsGetBuddy: esAdoptablePetsGetBuddy,
      adoptablePetsHybrid: esAdoptablePetsHybrid,
      adoptablePetsLocal: esAdoptablePetsLocal,
      adoptablePetsPetfinder: esAdoptablePetsPetfinder,
      pawPlacer: esPawPlacer,
      dogSpotlight: esDogSpotlight,
      eventsNews: esEventsNews,
      journeyTimeline: esJourneyTimeline,
      successStories: esSuccessStories,
      testimonials: esTestimonials,
      flyerLibrary: esFlyerLibrary,
      mediaGallery: esMediaGallery,
      faqDisclosure: esFaqDisclosure,
      newsHighlight: esNewsHighlight,
      formEmbedModal: esFormEmbedModal,
      paypalDonate: esPaypalDonate,
      zeffyDonate: esZeffyDonate,
      communityPartners: esCommunityPartners,
      supporterRecognition: esSupporterRecognition,
      impactStats: esImpactStats,
      spendBreakdown: esSpendBreakdown,
      impactAccountability: esImpactAccountability,
      kennelDisplayTools: esKennelDisplayTools,
      documents: esDocuments,
      found: esFound,
      placementHelp: esPlacementHelp,
      blog: esBlog,
    },
  },
  lng: savedLanguage,
  fallbackLng: "en",
  ns: [
    "common",
    "home",
    "errors",
    "standardsHome",
    "buildValidation",
    "ciBuild",
    "noJsFallbacks",
    "adoptablePets",
    "adoptablePetsAdoptAPet",
    "adoptablePetsGetBuddy",
    "adoptablePetsHybrid",
    "adoptablePetsLocal",
    "adoptablePetsPetfinder",
    "pawPlacer",
    "dogSpotlight",
    "eventsNews",
    "journeyTimeline",
    "successStories",
    "testimonials",
    "flyerLibrary",
    "mediaGallery",
    "faqDisclosure",
    "newsHighlight",
    "formEmbedModal",
    "paypalDonate",
    "zeffyDonate",
    "communityPartners",
    "supporterRecognition",
    "impactStats",
    "spendBreakdown",
    "impactAccountability",
    "kennelDisplayTools",
    "documents",
    "found",
    "placementHelp",
  ],
  defaultNS: "common",
  interpolation: { escapeValue: false },
});

if (isBrowser) {
  document.documentElement.lang = savedLanguage;
}

export default i18n;
