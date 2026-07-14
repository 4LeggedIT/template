import { useCallback, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { templateNavItems } from "@/config/navigation";
import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  sticky?: boolean;
  className?: string;
};

const getDesktopDropdownPositionClass = (dropdownIndex: number, dropdownCount: number) => {
  if (dropdownCount <= 1) return "left-1/2 -translate-x-1/2";
  if (dropdownIndex === 0) return "left-0";
  if (dropdownIndex === dropdownCount - 1) return "right-0";
  return "left-1/2 -translate-x-1/2";
};

const SiteHeader = ({ sticky = true, className }: SiteHeaderProps) => {
  const location = useLocation();
  const mobileNavRef = useRef<HTMLElement>(null);
  const mobileMenuToggleRef = useRef<HTMLInputElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const desktopDropdownItems = templateNavItems.filter((item) => item.dropdown);
  const desktopDropdownIndexByLabel = new Map(
    desktopDropdownItems.map((dropdownItem, index) => [dropdownItem.label, index]),
  );

  const isDropdownActive = useCallback(
    (items: { href: string }[]) => items.some((item) => location.pathname === item.href),
    [location.pathname],
  );

  useEffect(() => {
    const nav = mobileNavRef.current;
    if (!nav) return;

    nav.querySelectorAll("details[data-dropdown]").forEach((detailsEl) => {
      const label = detailsEl.getAttribute("data-dropdown");
      const navItem = templateNavItems.find((item) => item.dropdown && item.label === label);
      const shouldOpen = Boolean(navItem?.dropdown && isDropdownActive(navItem.dropdown));
      (detailsEl as HTMLDetailsElement).open = shouldOpen;
    });
  }, [isDropdownActive]);

  useEffect(() => {
    if (mobileMenuToggleRef.current) {
      mobileMenuToggleRef.current.checked = false;
    }
  }, [location.pathname, location.hash, location.search]);

  useEffect(() => {
    const nav = mobileNavRef.current;

    const handleNavClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!target) return;
      const activatedLink = target.closest("a[href]");
      if (activatedLink && mobileMenuToggleRef.current?.checked) {
        mobileMenuToggleRef.current.checked = false;
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (!mobileMenuToggleRef.current?.checked) return;
      const headerEl = headerRef.current;
      if (headerEl && !headerEl.contains(event.target as Node)) {
        mobileMenuToggleRef.current.checked = false;
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && mobileMenuToggleRef.current?.checked) {
        mobileMenuToggleRef.current.checked = false;
      }
    };

    nav?.addEventListener("click", handleNavClick);
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      nav?.removeEventListener("click", handleNavClick);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const closeMobileMenu = () => {
    if (mobileMenuToggleRef.current) mobileMenuToggleRef.current.checked = false;
  };

  return (
    <header
      ref={headerRef}
      className={cn(
        sticky ? "sticky top-0" : "relative",
        "z-40 border-b border-border bg-background/95 backdrop-blur",
        className,
      )}
    >
      <div className="container px-4">
        <input
          ref={mobileMenuToggleRef}
          id="mobile-menu-toggle"
          type="checkbox"
          className="peer sr-only md:hidden"
          aria-hidden="true"
        />

        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="font-semibold tracking-tight text-foreground">
            Template
          </Link>

          <nav className="hidden items-center gap-2 md:flex" aria-label="Primary navigation">
            {templateNavItems.map((item) =>
              item.dropdown ? (
                <div key={item.label} className="group relative">
                  <button
                    type="button"
                    aria-haspopup="true"
                    className={cn(
                      "flex items-center gap-1 rounded-lg px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      isDropdownActive(item.dropdown)
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {item.label}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <div
                    className={cn(
                      "pointer-events-none invisible absolute top-full z-50 pt-2 opacity-0 transition-all group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:opacity-100",
                      getDesktopDropdownPositionClass(
                        desktopDropdownIndexByLabel.get(item.label) ?? 0,
                        desktopDropdownItems.length,
                      ),
                    )}
                  >
                    <div className="max-h-[min(70vh,28rem)] w-[min(24rem,calc(100vw-2rem))] overflow-y-auto rounded-xl border border-border bg-popover p-2 shadow-lg">
                      {item.dropdown.map((subItem) => (
                        <NavLink
                          key={subItem.href}
                          to={subItem.href}
                          className={({ isActive }) =>
                            cn(
                              "block whitespace-normal break-words rounded-lg px-3 py-2 text-sm transition-colors",
                              isActive
                                ? "bg-primary/10 font-medium text-primary"
                                : "text-foreground/80 hover:bg-muted hover:text-foreground",
                            )
                          }
                        >
                          {subItem.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <NavLink
                  key={item.href}
                  to={item.href!}
                  className={({ isActive }) =>
                    cn(
                      "rounded-lg px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ),
            )}
          </nav>

          <label
            htmlFor="mobile-menu-toggle"
            className="flex cursor-pointer items-center gap-2 rounded-md p-2 text-foreground md:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5 peer-checked:hidden" />
            <X className="hidden h-5 w-5 peer-checked:block" />
            <span className="text-sm peer-checked:hidden">Menu</span>
            <span className="hidden text-sm peer-checked:inline">Close</span>
          </label>
        </div>

        <nav
          ref={mobileNavRef}
          className="hidden border-t border-border py-3 peer-checked:block md:hidden"
          aria-label="Mobile navigation"
        >
          <div className="space-y-2">
            {templateNavItems.map((item) =>
              item.dropdown ? (
                <details key={item.label} data-dropdown={item.label} className="group">
                  <summary
                    className={cn(
                      "flex cursor-pointer list-none items-center justify-between rounded-lg px-3 py-2 text-sm [&::-webkit-details-marker]:hidden",
                      isDropdownActive(item.dropdown)
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {item.label}
                    <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="mt-1 space-y-1 pl-3">
                    {item.dropdown.map((subItem) => (
                      <NavLink
                        key={subItem.href}
                        to={subItem.href}
                        onClick={closeMobileMenu}
                        className={({ isActive }) =>
                          cn(
                            "block rounded-lg px-3 py-2 text-sm",
                            isActive
                              ? "bg-primary/10 font-medium text-primary"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          )
                        }
                      >
                        {subItem.label}
                      </NavLink>
                    ))}
                  </div>
                </details>
              ) : (
                <NavLink
                  key={item.href}
                  to={item.href!}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    cn(
                      "block rounded-lg px-3 py-2 text-sm",
                      isActive
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ),
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default SiteHeader;
