export type PrintableDocConfig = {
  orgName: string;
  orgTagline?: string;
  logoSrc: string;
  adoptUrl: string;
  fosterUrl?: string;
  contact: {
    phone?: string;
    phoneDisplay?: string;
    email?: string;
    website: string;
    city?: string;
    state?: string;
  };
  donation?: {
    venmoQrSrc?: string;
    zelleQrSrc?: string;
    venmoHandle?: string;
    zelleEmailOrPhone?: string;
    zelleLabel?: string;
    donationUses?: string[];
  };
  social?: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
  };
};
