export {};

declare global {
  interface Window {
    PayPal?: {
      Donation?: {
        Button?: (options: {
          env: "production" | "sandbox";
          hosted_button_id?: string;
          business?: string;
          image?: { src?: string; alt?: string; title?: string };
          onComplete?: (params: Record<string, unknown>) => void;
        }) => { render: (target: string) => void };
      };
    };
  }
}

