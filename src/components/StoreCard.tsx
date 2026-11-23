'use client';

import React, { useState } from 'react';
import { StoreInfo } from '@/lib/supabase';
import { trackEvent, trackLead } from '@/lib/analytics';

interface StoreCardProps {
  store: StoreInfo;
}

export function StoreCard({ store }: StoreCardProps) {
  const [toastVisible, setToastVisible] = useState(false);
  const [copiedCode, setCopiedCode] = useState(store.cupom || 'MAISROTINA');
  const [copiedRecently, setCopiedRecently] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [needsWhiteBg, setNeedsWhiteBg] = useState(false);

  // Detecta se a imagem é um PNG/SVG transparente (sem fundo) para aplicar fundo branco
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, 32, 32);
      const imgData = ctx.getImageData(0, 0, 32, 32).data;

      // Amostra dos 4 cantos da imagem
      const corner1 = imgData[3];
      const corner2 = imgData[31 * 4 + 3];
      const corner3 = imgData[(31 * 32) * 4 + 3];
      const corner4 = imgData[(31 * 32 + 31) * 4 + 3];

      let transparentCount = 0;
      for (let i = 3; i < imgData.length; i += 4) {
        if (imgData[i] < 220) transparentCount++;
      }

      // Se os cantos forem transparentes ou mais de 8% da imagem tiver transparência:
      const hasTransparency =
        corner1 < 180 ||
        corner2 < 180 ||
        corner3 < 180 ||
        corner4 < 180 ||
        (transparentCount / (32 * 32) > 0.08);

      setNeedsWhiteBg(hasTransparency);
    } catch {
      // Fallback seguro caso haja bloqueio de leitura: se a URL for PNG ou SVG, assume transparente
      const isPngOrSvg = /\.(png|svg)(\?.*)?$/i.test(img.src);
      setNeedsWhiteBg(isPngOrSvg);
    }
  };

  const handleCardClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    const cupom = store.cupom || 'MAISROTINA';

    // 1. Copia o código para a área de transferência
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(cupom);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = cupom;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('Falha ao copiar cupom:', err);
    }

    // 2. Dispara evento de conversão / Lead para ADS (Meta Pixel, Google, TikTok, GTM)
    trackEvent('copy_coupon', {
      store: store.nome,
      coupon: cupom,
    });
    trackLead({
      content_name: store.nome,
      coupon: cupom,
    });

    // 3. Exibe o toast animado e feedback no botão (sem redirecionar)
    setCopiedCode(cupom);
    setToastVisible(true);
    setCopiedRecently(true);

    setTimeout(() => {
      setToastVisible(false);
    }, 3000);

    setTimeout(() => {
      setCopiedRecently(false);
    }, 3000);
  };

  return (
    <>
      <div className="instabio-card">
        {/* Badge de Status / Verificação Ativa */}
        <div className="coupon-status-badge">
          <span className="coupon-status-dot" aria-hidden="true" />
          <span className="coupon-status-text">
            Cupom <strong>{store.cupom}</strong> verificado e ativo hoje na {store.nome}
          </span>
        </div>

        <div
          className="dynamic-coupon-card coupon-card"
          onClick={handleCardClick}
          role="button"
          tabIndex={0}
          aria-label={`Copiar cupom de desconto ${store.cupom} da ${store.nome}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleCardClick(e as any);
            }
          }}
        >
          {/* Luzes bokeh decorativas nos cantos */}
          <div className="dynamic-bokeh dynamic-bokeh-top-right" />
          <div className="dynamic-bokeh dynamic-bokeh-bottom-left" />

          <div className="dynamic-card-inner">
            {/* Logo da Marca Dinâmica */}
            <div className="dynamic-card-brand-wrap">
              {store.logo && !logoError ? (
                <div className={`coupon-card-logo-box ${needsWhiteBg ? 'has-white-bg' : ''}`}>
                  <img
                    src={store.logo}
                    alt={`Logo ${store.nome}`}
                    className="dynamic-card-logo"
                    crossOrigin="anonymous"
                    onLoad={handleImageLoad}
                    onError={() => setLogoError(true)}
                  />
                </div>
              ) : (
                <span className="dynamic-card-brand">{store.nome}</span>
              )}
            </div>

            {/* Slogan / Subtítulo Dinâmico */}
            <p className="dynamic-card-subtitle">{store.subtitulo}</p>

            {/* Caixa estilo Ticket com Borda Tracejada e Cupom */}
            <div className="dynamic-card-ticket">
              <span className="dynamic-ticket-label">CUPOM DE DESCONTO</span>
              <strong className="dynamic-ticket-code">{store.cupom}</strong>
            </div>

            {/* Botão Dourado Metálico */}
            <div className="dynamic-card-btn-wrap">
              <span className="dynamic-card-btn">
                {copiedRecently ? '✓ CUPOM COPIADO!' : 'COPIAR CUPOM'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Toast de Confirmação Flutuante */}
      <div
        className={`coupon-toast ${toastVisible ? 'show' : ''}`}
        role="status"
        aria-live="polite"
      >
        <span className="coupon-toast-icon">✓</span>
        <span>
          Cupom <strong>{copiedCode}</strong> copiado!
        </span>
      </div>
    </>
  );
}
