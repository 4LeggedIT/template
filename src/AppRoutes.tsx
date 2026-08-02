import { Route, Routes } from "react-router-dom";
import SiteLayout from "@/components/patterns/SiteLayout";
import HomePage from "@/pages/HomePage";
import NotFound from "@/pages/NotFound";
import Oops from "@/pages/Oops";
import BuildValidationPage from "@/pages/standards/BuildValidationPage";
import CiBuildWorkflowPage from "@/pages/standards/CiBuildWorkflowPage";
import NoJsFallbacksWorkflowPage from "@/pages/standards/NoJsFallbacksWorkflowPage";
import AdoptablePetsStandardPage from "@/pages/standards/AdoptablePetsStandardPage";
import AdoptablePetsLocalStandardPage from "@/pages/standards/AdoptablePetsLocalStandardPage";
import AdoptablePetsPetfinderStandardPage from "@/pages/standards/AdoptablePetsPetfinderStandardPage";
import AdoptablePetsAdoptAPetStandardPage from "@/pages/standards/AdoptablePetsAdoptAPetStandardPage";
import AdoptablePetsGetBuddyStandardPage from "@/pages/standards/AdoptablePetsGetBuddyStandardPage";
import AdoptablePetsHybridStandardPage from "@/pages/standards/AdoptablePetsHybridStandardPage";
import EventsNewsStandardPage from "@/pages/standards/EventsNewsStandardPage";
import NewsHighlightStandardPage from "@/pages/standards/NewsHighlightStandardPage";
import DogSpotlightStandardPage from "@/pages/standards/DogSpotlightStandardPage";
import JourneyTimelineStandardPage from "@/pages/standards/JourneyTimelineStandardPage";
import PawPlacerStandardPage from "@/pages/standards/PawPlacerStandardPage";
import FaqDisclosureStandardPage from "@/pages/standards/FaqDisclosureStandardPage";
import FoundStandardPage from "@/pages/standards/FoundStandardPage";
import FormEmbedModalStandardPage from "@/pages/standards/FormEmbedModalStandardPage";
import FlyerLibraryStandardPage from "@/pages/standards/FlyerLibraryStandardPage";
import CommunityPartnersStandardPage from "@/pages/standards/CommunityPartnersStandardPage";
import SupporterRecognitionStandardPage from "@/pages/standards/SupporterRecognitionStandardPage";
import ImpactStatsStandardPage from "@/pages/standards/ImpactStatsStandardPage";
import SpendBreakdownStandardPage from "@/pages/standards/SpendBreakdownStandardPage";
import ImpactAccountabilityStandardPage from "@/pages/standards/ImpactAccountabilityStandardPage";
import MediaGalleryStandardPage from "@/pages/standards/MediaGalleryStandardPage";
import PayPalDonatePatternPage from "@/pages/standards/PayPalDonatePatternPage";
import PlacementHelpStandardPage from "@/pages/standards/PlacementHelpStandardPage";
import SuccessStoriesStandardPage from "@/pages/standards/SuccessStoriesStandardPage";
import TemplateStandardsHomePage from "@/pages/standards/TemplateStandardsHomePage";
import TestimonialsStandardPage from "@/pages/standards/TestimonialsStandardPage";
import KennelDisplayToolsStandardPage from "@/pages/standards/KennelDisplayToolsStandardPage";
import DocumentsStandardPage from "@/pages/standards/DocumentsStandardPage";
import BlogStandardPage from "@/pages/standards/BlogStandardPage";
import EventsNewsExampleEventDetailPage from "@/pages/examples/EventsNewsExampleEventDetailPage";
import BlogExamplePostPage from "@/pages/examples/BlogExamplePostPage";
import NewsArticleExamplePage from "@/pages/news/NewsArticleExamplePage";
import AdoptableSlideshowPage from "@/pages/tools/AdoptableSlideshowPage";
import KennelBinder2UpPage from "@/pages/tools/KennelBinder2UpPage";
import KennelCards2UpPage from "@/pages/tools/KennelCards2UpPage";
import DocumentsIndexPage from "@/pages/tools/DocumentsIndexPage";
import AdoptionCertificatePage from "@/pages/tools/AdoptionCertificatePage";
import PetMedicalRecordPage from "@/pages/tools/PetMedicalRecordPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/oops" element={<Oops />} />
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
        <Route path="/news/example-article" element={<NewsArticleExamplePage />} />
        <Route path="/examples/blog/:slug" element={<BlogExamplePostPage />} />
        <Route path="/standards" element={<TemplateStandardsHomePage />} />
        <Route path="/standards/adoptable-pets" element={<AdoptablePetsStandardPage />} />
        <Route path="/standards/adoptable-pets/local" element={<AdoptablePetsLocalStandardPage />} />
        <Route path="/standards/adoptable-pets/petfinder" element={<AdoptablePetsPetfinderStandardPage />} />
        <Route path="/standards/adoptable-pets/adopt-a-pet" element={<AdoptablePetsAdoptAPetStandardPage />} />
        <Route path="/standards/adoptable-pets/getbuddy" element={<AdoptablePetsGetBuddyStandardPage />} />
        <Route path="/standards/adoptable-pets/hybrid" element={<AdoptablePetsHybridStandardPage />} />
        <Route path="/standards/events-news" element={<EventsNewsStandardPage />} />
        <Route path="/standards/news-highlight" element={<NewsHighlightStandardPage />} />
        <Route path="/standards/dog-spotlight" element={<DogSpotlightStandardPage />} />
        <Route path="/standards/journey-timeline" element={<JourneyTimelineStandardPage />} />
        <Route path="/standards/pawplacer" element={<PawPlacerStandardPage />} />
        <Route path="/standards/faq-disclosure" element={<FaqDisclosureStandardPage />} />
        <Route path="/standards/found" element={<FoundStandardPage />} />
        <Route path="/standards/form-embed-modal" element={<FormEmbedModalStandardPage />} />
        <Route path="/standards/flyer-library" element={<FlyerLibraryStandardPage />} />
        <Route path="/standards/community-partners" element={<CommunityPartnersStandardPage />} />
        <Route path="/standards/supporter-recognition" element={<SupporterRecognitionStandardPage />} />
        <Route path="/standards/impact-stats" element={<ImpactStatsStandardPage />} />
        <Route path="/standards/spend-breakdown" element={<SpendBreakdownStandardPage />} />
        <Route path="/standards/impact-accountability" element={<ImpactAccountabilityStandardPage />} />
        <Route path="/standards/media-gallery" element={<MediaGalleryStandardPage />} />
        <Route path="/standards/paypal-donate" element={<PayPalDonatePatternPage />} />
        <Route path="/standards/placement-help" element={<PlacementHelpStandardPage />} />
        <Route path="/standards/success-stories" element={<SuccessStoriesStandardPage />} />
        <Route path="/standards/testimonials" element={<TestimonialsStandardPage />} />
        <Route path="/standards/workflow/build-validation" element={<BuildValidationPage />} />
        <Route path="/standards/workflow/ci-build" element={<CiBuildWorkflowPage />} />
        <Route path="/standards/workflow/no-js-fallbacks" element={<NoJsFallbacksWorkflowPage />} />
        <Route path="/standards/kennel-display-tools" element={<KennelDisplayToolsStandardPage />} />
        <Route path="/standards/documents" element={<DocumentsStandardPage />} />
        <Route path="/standards/blog" element={<BlogStandardPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="/tools/adoptable-slideshow" element={<AdoptableSlideshowPage />} />
      <Route path="/tools/kennel-binder-2up" element={<KennelBinder2UpPage />} />
      <Route path="/tools/kennel-cards-2up" element={<KennelCards2UpPage />} />
      <Route path="/tools/documents-index" element={<DocumentsIndexPage />} />
      <Route path="/tools/adoption-certificate" element={<AdoptionCertificatePage />} />
      <Route path="/tools/pet-medical-record" element={<PetMedicalRecordPage />} />
    </Routes>
  );
};

export default AppRoutes;
