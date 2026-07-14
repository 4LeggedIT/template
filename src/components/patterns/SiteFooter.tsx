const SiteFooter = () => {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="container px-4 py-8 text-sm text-muted-foreground">
        <p>Template footer placeholder for shared layout validation.</p>
        <p className="mt-2">
          Repository:{" "}
          <a
            href="https://github.com/4LeggedIT/template"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:no-underline"
          >
            github.com/4LeggedIT/template
          </a>
        </p>
      </div>
    </footer>
  );
};

export default SiteFooter;
