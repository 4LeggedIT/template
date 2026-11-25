export {};

declare global {
  interface Window {
    paypal?: {
      HostedButtons?: (options: { hostedButtonId: string }) => {
        render: (target: string) => Promise<void> | void;
      };
    };
  }
}
