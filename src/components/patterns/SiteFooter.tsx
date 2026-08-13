import { useTranslation } from "react-i18next";
import { PawPrint } from "lucide-react";
import logo from "@/assets/4leggedit-logo.webp";

const SiteFooter = () => {
  const { t } = useTranslation("common");
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      {/* CTA banner — 4leggedIT brand gradient */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary via-highlight to-primary py-10 md:py-14">
        <PawPrint className="absolute left-8 top-4 h-8 w-8 text-primary-foreground/20" />
        <PawPrint className="absolute bottom-4 right-12 h-7 w-7 text-primary-foreground/20" />
        <PawPrint className="absolute right-1/4 top-1/2 h-12 w-12 -translate-y-1/2 text-primary-foreground/10" />

        <div className="container relative z-10 px-4 text-center">
          <h3 className="mb-4 text-2xl font-bold text-primary-foreground md:text-3xl lg:text-4xl">
            {t("footer.ctaTitle")}
          </h3>
          <p className="mx-auto mb-6 max-w-xl text-primary-foreground/90">{t("footer.ctaDescription")}</p>
          <a
            href="https://www.4leggedit.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 font-semibold text-foreground shadow-lg transition hover:shadow-xl"
          >
            <PawPrint className="h-4 w-4" />
            {t("footer.ctaButton")}
          </a>
        </div>
      </div>

      {/* Main footer — dark paw color */}
      <div className="bg-paw py-10 text-paw-foreground md:py-12">
        <div className="container px-4">
          <div className="flex flex-col items-center gap-4 text-center md:flex-row md:items-start md:justify-between md:text-left">
            <div className="max-w-sm">
              <a
                href="https://www.4leggedit.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold text-paw-foreground transition-colors hover:text-primary"
              >
                <img src={logo} alt="4leggedIT" className="h-14 w-14 object-contain" />
                {t("footer.builtOn", { brand: "4leggedIT" })}
              </a>
              <p className="mt-3 text-sm leading-relaxed text-paw-foreground/75">{t("footer.description")}</p>
            </div>

            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm md:justify-end">
              <a
                href="https://github.com/4LeggedIT/template"
                target="_blank"
                rel="noopener noreferrer"
                className="text-paw-foreground/70 underline underline-offset-2 transition-colors hover:text-primary hover:no-underline"
              >
                {t("footer.linkRepo")}
              </a>
            </div>
          </div>

          <div className="mt-8 border-t border-paw-foreground/10 pt-6 text-center">
            <p className="text-xs text-paw-foreground/50">{t("footer.copyright", { year: currentYear })}</p>
            <p className="mt-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-paw-foreground/50">
              <a
                href="https://www.4leggedit.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 transition-colors hover:text-primary hover:no-underline"
              >
                {t("footer.linkTerms")}
              </a>
              <span aria-hidden="true">·</span>
              <a
                href="https://www.4leggedit.com/vulnerability-disclosure-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 transition-colors hover:text-primary hover:no-underline"
              >
                {t("footer.linkVdp")}
              </a>
              <span aria-hidden="true">·</span>
              <a
                href="https://www.4leggedit.com/security-hall-of-fame"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 transition-colors hover:text-primary hover:no-underline"
              >
                {t("footer.linkHallOfFame")}
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
