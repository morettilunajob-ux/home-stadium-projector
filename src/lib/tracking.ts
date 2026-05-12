// Tracking helper: appends UTM params and fires analytics events
// for any external CTA click (checkout / upsell links).

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export type ProductId = "projetor";

interface TrackOptions {
  product: ProductId;
  price: number;
  source: string; // hero, sticky-top, sticky-bottom, upsell, final-cta...
}

const PRODUCT_NAMES: Record<ProductId, string> = {
  projetor: "ArenaBox Pro",
};

export function buildCheckoutUrl(baseUrl: string, opts: TrackOptions): string {
  try {
    const url = new URL(baseUrl);
    url.searchParams.set("utm_source", "landing");
    url.searchParams.set("utm_medium", "cta");
    url.searchParams.set("utm_campaign", "arenabox-copa");
    url.searchParams.set("utm_content", opts.source);
    url.searchParams.set("utm_term", opts.product);
    return url.toString();
  } catch {
    return baseUrl;
  }
}

export function trackClick(opts: TrackOptions) {
  if (typeof window === "undefined") return;
  const payload = {
    event: "cta_click",
    product_id: opts.product,
    product_name: PRODUCT_NAMES[opts.product],
    price: opts.price,
    currency: "BRL",
    source: opts.source,
    timestamp: new Date().toISOString(),
  };
  // dataLayer (GTM)
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
  // gtag (GA4) — begin_checkout style
  if (typeof window.gtag === "function") {
    window.gtag("event", "begin_checkout", {
      currency: "BRL",
      value: opts.price,
      items: [
        {
          item_id: opts.product,
          item_name: PRODUCT_NAMES[opts.product],
          price: opts.price,
          quantity: 1,
        },
      ],
      source: opts.source,
    });
  }
  // Meta Pixel
  if (typeof window.fbq === "function") {
    window.fbq("track", "InitiateCheckout", {
      content_ids: [opts.product],
      content_name: PRODUCT_NAMES[opts.product],
      value: opts.price,
      currency: "BRL",
    });
  }
  // Console fallback so the user can verify in DevTools
  // eslint-disable-next-line no-console
  console.log("[track]", payload);
}