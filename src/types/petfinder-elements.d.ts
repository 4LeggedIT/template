declare namespace JSX {
  interface IntrinsicElements {
    "pet-scroller": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      s3Url?: string;
      apiBase?: string;
      organization?: string;
      status?: string;
      petfinderUrl?: string;
      hideBreed?: string;
      limit?: string;
      petListTitle?: string;
    };
  }
}
