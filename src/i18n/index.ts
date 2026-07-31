import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from "@/locales/en/common.json";
import enHome from "@/locales/en/home.json";
import enErrors from "@/locales/en/errors.json";

import esCommon from "@/locales/es/common.json";
import esHome from "@/locales/es/home.json";
import esErrors from "@/locales/es/errors.json";

const isBrowser = typeof window !== "undefined";
const savedLanguage = isBrowser ? (localStorage.getItem("language") ?? "en") : "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { common: enCommon, home: enHome, errors: enErrors },
    es: { common: esCommon, home: esHome, errors: esErrors },
  },
  lng: savedLanguage,
  fallbackLng: "en",
  ns: ["common", "home", "errors"],
  defaultNS: "common",
  interpolation: { escapeValue: false },
});

if (isBrowser) {
  document.documentElement.lang = savedLanguage;
}

export default i18n;
