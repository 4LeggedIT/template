import { BrowserRouter } from "react-router-dom";
import AppProviders from "./AppProviders";
import AppRoutes from "./AppRoutes";
import ScrollToTop from "./components/ScrollToTop";
import StructuredData from "./components/patterns/StructuredData";
import { organizationJsonLd } from "./lib/organizationJsonLd";

const App = () => (
  <AppProviders>
    <BrowserRouter>
      <StructuredData data={organizationJsonLd} />
      <ScrollToTop />
      <AppRoutes />
    </BrowserRouter>
  </AppProviders>
);

export default App;
