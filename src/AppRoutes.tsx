import { Route, Routes } from "react-router-dom";
import SiteLayout from "@/components/patterns/SiteLayout";
import ExamplesIndexPage from "@/pages/ExamplesIndexPage";
import HomePage from "@/pages/HomePage";
import NotFound from "@/pages/NotFound";
import Oops from "@/pages/Oops";
import BuildValidationPage from "@/pages/docs/BuildValidationPage";
import CiBuildWorkflowPage from "@/pages/docs/CiBuildWorkflowPage";
import AdoptablePetsStandardPage from "@/pages/docs/AdoptablePetsStandardPage";
import EventsNewsStandardPage from "@/pages/docs/EventsNewsStandardPage";
import FaqDisclosureStandardPage from "@/pages/docs/FaqDisclosureStandardPage";
import FoundStandardPage from "@/pages/docs/FoundStandardPage";
import FormEmbedModalStandardPage from "@/pages/docs/FormEmbedModalStandardPage";
import MediaGalleryStandardPage from "@/pages/docs/MediaGalleryStandardPage";
import PayPalDonatePatternPage from "@/pages/docs/PayPalDonatePatternPage";
import PlacementHelpStandardPage from "@/pages/docs/PlacementHelpStandardPage";
import SuccessStoriesStandardPage from "@/pages/docs/SuccessStoriesStandardPage";
import TemplateDocsHomePage from "@/pages/docs/TemplateDocsHomePage";
import TestimonialsStandardPage from "@/pages/docs/TestimonialsStandardPage";
import FaqDisclosureExamplePage from "@/pages/examples/FaqDisclosureExamplePage";
import EventsNewsExamplePage from "@/pages/examples/EventsNewsExamplePage";
import AdoptablePetsExamplePage from "@/pages/examples/AdoptablePetsExamplePage";
import FormEmbedModalExamplePage from "@/pages/examples/FormEmbedModalExamplePage";
import FoundExamplePage from "@/pages/examples/FoundExamplePage";
import MediaGalleryExamplePage from "@/pages/examples/MediaGalleryExamplePage";
import NoJsFallbacksExamplePage from "@/pages/examples/NoJsFallbacksExamplePage";
import PayPalDonateExamplePage from "@/pages/examples/PayPalDonateExamplePage";
import PlacementHelpExamplePage from "@/pages/examples/PlacementHelpExamplePage";
import SuccessStoriesExamplePage from "@/pages/examples/SuccessStoriesExamplePage";
import TestimonialsExamplePage from "@/pages/examples/TestimonialsExamplePage";
import EventsNewsExampleEventDetailPage from "@/pages/examples/EventsNewsExampleEventDetailPage";
import NewsArticleExamplePage from "@/pages/news/NewsArticleExamplePage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/oops" element={<Oops />} />
        <Route path="/examples" element={<ExamplesIndexPage />} />
        <Route path="/examples/adoptable-pets" element={<AdoptablePetsExamplePage />} />
        <Route path="/examples/events-news" element={<EventsNewsExamplePage />} />
        <Route
          path="/examples/events-news/events/event-adoption-fridays"
          element={<EventsNewsExampleEventDetailPage eventSlug="event-adoption-fridays" />}
        />
        <Route
          path="/examples/events-news/events/event-biweekly-supply-drive"
          element={<EventsNewsExampleEventDetailPage eventSlug="event-biweekly-supply-drive" />}
        />
        <Route
          path="/examples/events-news/events/event-second-weekend-fair"
          element={<EventsNewsExampleEventDetailPage eventSlug="event-second-weekend-fair" />}
        />
        <Route
          path="/examples/events-news/events/event-monthly-5th-orientation"
          element={<EventsNewsExampleEventDetailPage eventSlug="event-monthly-5th-orientation" />}
        />
        <Route
          path="/examples/events-news/events/event-yard-sale-2026-02-21"
          element={<EventsNewsExampleEventDetailPage eventSlug="event-yard-sale-2026-02-21" />}
        />
        <Route path="/examples/form-embed-modal" element={<FormEmbedModalExamplePage />} />
        <Route path="/examples/found" element={<FoundExamplePage />} />
        <Route path="/examples/faq-disclosure" element={<FaqDisclosureExamplePage />} />
        <Route path="/examples/media-gallery" element={<MediaGalleryExamplePage />} />
        <Route path="/examples/placement-help" element={<PlacementHelpExamplePage />} />
        <Route path="/examples/paypal-donate" element={<PayPalDonateExamplePage />} />
        <Route path="/examples/no-js-fallbacks" element={<NoJsFallbacksExamplePage />} />
        <Route path="/examples/success-stories" element={<SuccessStoriesExamplePage />} />
        <Route path="/examples/testimonials" element={<TestimonialsExamplePage />} />
        <Route path="/news/example-article" element={<NewsArticleExamplePage />} />
        <Route path="/docs" element={<TemplateDocsHomePage />} />
        <Route path="/docs/standards/adoptable-pets" element={<AdoptablePetsStandardPage />} />
        <Route path="/docs/standards/events-news" element={<EventsNewsStandardPage />} />
        <Route path="/docs/standards/faq-disclosure" element={<FaqDisclosureStandardPage />} />
        <Route path="/docs/standards/found" element={<FoundStandardPage />} />
        <Route path="/docs/standards/form-embed-modal" element={<FormEmbedModalStandardPage />} />
        <Route path="/docs/standards/media-gallery" element={<MediaGalleryStandardPage />} />
        <Route path="/docs/standards/paypal-donate" element={<PayPalDonatePatternPage />} />
        <Route path="/docs/standards/placement-help" element={<PlacementHelpStandardPage />} />
        <Route path="/docs/standards/success-stories" element={<SuccessStoriesStandardPage />} />
        <Route path="/docs/standards/testimonials" element={<TestimonialsStandardPage />} />
        <Route path="/docs/workflow/build-validation" element={<BuildValidationPage />} />
        <Route path="/docs/workflow/ci-build" element={<CiBuildWorkflowPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
