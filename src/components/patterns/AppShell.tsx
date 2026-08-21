import { Outlet } from "react-router-dom";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

const AppShell = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="print:hidden">
        <SiteHeader />
      </div>
      <main>
        <Outlet />
      </main>
      <div className="print:hidden">
        <SiteFooter />
      </div>
    </div>
  );
};

export default AppShell;
