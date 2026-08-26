import { Helmet } from "react-helmet-async";

type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | JsonLdValue[]
  | { [key: string]: JsonLdValue };

type StructuredDataProps = {
  data: { [key: string]: JsonLdValue };
};

const StructuredData = ({ data }: StructuredDataProps) => {
  // react-helmet-async writes this string into the page verbatim and
  // JSON.stringify() leaves "<" un-escaped, so an unescaped closing
  // script tag in any field value would end this block early and turn
  // whatever follows into live, executing markup. The unicode escape
  // below is valid inside a JSON string and round-trips byte-identical
  // through JSON.parse.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <Helmet>
      <script type="application/ld+json">{json}</script>
    </Helmet>
  );
};

export default StructuredData;
