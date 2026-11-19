// Tipagem e utilitários para disparo de eventos de Analytics e ADS (Meta, Google, TikTok, GTM)

declare global {
  interface Window {
    dataLayer?: any[];
    fbq?: (...args: any[]) => void;
    gtag?: (...args: any[]) => void;
    ttq?: {
      track: (event: string, params?: any) => void;
      page: () => void;
      load: (pixelId: string) => void;
    };
  }
}

/**
 * Dispara evento genérico para todas as plataformas de ADS ativas
 */
export function trackEvent(eventName: string, params: Record<string, any> = {}) {
  if (typeof window === 'undefined') return;

  // 1. Google Tag Manager (DataLayer)
  if (window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...params,
    });
  }

  // 2. Google Analytics / Google Ads (gtag)
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }

  // 3. Meta Pixel (Facebook Ads)
  if (typeof window.fbq === 'function') {
    window.fbq('trackCustom', eventName, params);
  }

  // 4. TikTok Pixel
  if (window.ttq && typeof window.ttq.track === 'function') {
    window.ttq.track(eventName, params);
  }
}

/**
 * Dispara evento padrão de Conversão / Lead (ex: copiar cupom, clicar em link de compra)
 */
export function trackLead(params: Record<string, any> = {}) {
  if (typeof window === 'undefined') return;

  // Meta Pixel padrão 'Lead'
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Lead', params);
  }

  // GA / GTM
  trackEvent('generate_lead', params);
}

/**
 * Dispara evento de clique em link externo (Amazon, YouTube, Instagram)
 */
export function trackOutboundClick(destination: string, label: string) {
  trackEvent('outbound_click', {
    destination,
    label,
  });

  // Meta Pixel ViewContent
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'ViewContent', {
      content_name: label,
      content_category: destination,
    });
  }
}
