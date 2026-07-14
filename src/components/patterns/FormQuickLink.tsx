import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

type FormQuickLinkProps = {
  formUrl: string;
};

const FormQuickLink = ({ formUrl }: FormQuickLinkProps) => {
  useEffect(() => {
    window.location.replace(formUrl);
  }, [formUrl]);

  return (
    <>
      <Helmet>
        <meta httpEquiv="refresh" content={`0;url=${formUrl}`} />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">
          Redirecting…{" "}
          <a href={formUrl} className="underline underline-offset-4 hover:text-foreground">
            Click here if you are not redirected automatically.
          </a>
        </p>
      </div>
    </>
  );
};

export default FormQuickLink;
