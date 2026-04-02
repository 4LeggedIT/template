import { renderToString } from "react-dom/server";
import { MotionConfig } from "framer-motion";
import { HelmetProvider } from "react-helmet-async/lib/index.esm.js";
import { StaticRouter } from "react-router-dom/server";
import ScrollToTop from "./components/ScrollToTop";
import AppProviders from "./AppProviders";
import AppRoutes from "./AppRoutes";

type RenderResult = {
  appHtml: string;
  headHtml: string;
};

type HelmetEntry = { toString?: () => string };
type HelmetSnapshot = Partial<Record<"title" | "meta" | "link" | "script", HelmetEntry>>;

export async function render(url: string): Promise<RenderResult> {
  const helmetContext: { helmet?: HelmetSnapshot } = {};

  const app = (
    <MotionConfig isStatic>
      <HelmetProvider context={helmetContext}>
        <AppProviders>
          <StaticRouter location={url}>
            <ScrollToTop />
            <AppRoutes />
          </StaticRouter>
        </AppProviders>
      </HelmetProvider>
    </MotionConfig>
  );

  const appHtml = renderToString(app);
  const helmet = helmetContext.helmet;

  const headParts = [
    helmet?.title?.toString?.() ?? "",
    helmet?.meta?.toString?.() ?? "",
    helmet?.link?.toString?.() ?? "",
    helmet?.script?.toString?.() ?? "",
  ];

  return { appHtml, headHtml: headParts.filter(Boolean).join("\n") };
}
