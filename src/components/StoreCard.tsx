'use client';

import React, { useState } from 'react';
import { StoreInfo } from '@/lib/supabase';

interface StoreCardProps {
  store: StoreInfo;
}

export function StoreCard({ store }: StoreCardProps) {
  const [toastVisible, setToastVisible] = useState(false);
  const [copiedCode, setCopiedCode] = useState(store.cupom || 'MAISROTINA');

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

    // 2. Exibe o toast animado
    setCopiedCode(cupom);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 3000);

    // 3. Se houver link externo válido, abre a loja em nova aba para o usuário já aproveitar
    if (store.link && store.link !== '#') {
      setTimeout(() => {
        window.open(store.link, '_blank', 'noopener,noreferrer');
      }, 400);
    }
  };

  return (
    <>
      <div className="instabio-card">
        <div
          className="dynamic-coupon-card"
          onClick={handleCardClick}
          role="button"
          tabIndex={0}
          aria-label={`Copiar cupom ${store.cupom} da ${store.nome} e abrir loja`}
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
            {/* Nome da Marca Dinâmica */}
            <div className="dynamic-card-brand-wrap">
              <span className="dynamic-card-brand">{store.nome}</span>
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
              <span className="dynamic-card-btn">CLIQUE E APROVEITE</span>
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
