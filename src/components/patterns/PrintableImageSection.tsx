import "@/styles/documents.css";
import PrintPageHeader from "@/components/patterns/PrintPageHeader";

type PrintableImageSectionProps = {
  /** The image to print. Not part of this pattern — supplied by the caller (a certificate, sign, poster, etc. designed elsewhere). */
  imageSrc: string;
  imageAlt: string;
  /** Page orientation. Determines the default page size (Letter) when width/height aren't overridden. */
  orientation?: "portrait" | "landscape";
  /** Override the page's printed width, in inches. Defaults to Letter for the given orientation. */
  pageWidthIn?: number;
  /** Override the page's printed height, in inches. Defaults to Letter for the given orientation. */
  pageHeightIn?: number;
  /** "contain" (default) shows the whole image, letterboxed if its aspect ratio doesn't match the page exactly. "cover" fills the page edge-to-edge, cropping the image if needed. */
  fit?: "contain" | "cover";
  /** Shown above the printable area, e.g. "Print on cardstock for best results." */
  printInstructions: string;
  buttonLabel?: string;
};

const PrintableImageSection = ({
  imageSrc,
  imageAlt,
  orientation = "portrait",
  pageWidthIn,
  pageHeightIn,
  fit = "contain",
  printInstructions,
  buttonLabel = "Print",
}: PrintableImageSectionProps) => {
  const defaultWidth = orientation === "landscape" ? 11 : 8.5;
  const defaultHeight = orientation === "landscape" ? 8.5 : 11;
  const pageW = pageWidthIn ?? defaultWidth;
  const pageH = pageHeightIn ?? defaultHeight;

  return (
    <div className="doc-body printable-image-doc">
      <style>{`
        @page { size: ${pageW}in ${pageH}in; margin: 0; }

        .pis-page {
          background: #fff;
          box-sizing: border-box;
          height: ${pageH}in;
          margin: 20px auto;
          overflow: hidden;
          position: relative;
          width: ${pageW}in;
          box-shadow: 0 3px 16px rgba(0,0,0,0.14);
        }

        .pis-img {
          display: block;
          height: 100%;
          object-fit: ${fit};
          width: 100%;
        }

        @media print {
          .pis-page {
            box-shadow: none;
            margin: 0;
          }
        }
      `}</style>

      <PrintPageHeader buttonLabel={buttonLabel} instructions={printInstructions} />

      <section className="pis-page">
        <img src={imageSrc} alt={imageAlt} className="pis-img" />
      </section>
    </div>
  );
};

export default PrintableImageSection;
