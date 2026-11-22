'use client';

import React, { useState, useEffect } from 'react';

type ModalType = 'privacy' | 'terms' | null;

export function LegalFooter() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // Close on Escape key and prevent background scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModal(null);
      }
    };

    if (activeModal) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeModal]);

  return (
    <>
      <footer className="legal-footer">
        <p className="legal-footer-copy">
          © 2026 Georgia Bachi — Nutricionista e Escritora. Todos os direitos reservados.
        </p>
        <div className="legal-footer-links">
          <button
            type="button"
            className="legal-footer-link"
            onClick={() => setActiveModal('privacy')}
          >
            Política de Privacidade
          </button>
          <button
            type="button"
            className="legal-footer-link"
            onClick={() => setActiveModal('terms')}
          >
            Termos de Uso
          </button>
        </div>
      </footer>

      {activeModal && (
        <div
          className="legal-modal-overlay"
          onClick={() => setActiveModal(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="legal-modal-heading"
        >
          <div
            className="legal-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            {activeModal === 'privacy' && (
              <>
                <h3 id="legal-modal-heading" className="legal-modal-title">
                  Política de Privacidade
                </h3>
                <div className="legal-modal-body">
                  <p>
                    Esta página respeita a sua privacidade e atua em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
                  </p>
                  <p>
                    Utilizamos cookies e ferramentas de análise (como Google Tag Manager e Google Ads) exclusivamente para mensurar o desempenho de campanhas publicitárias e melhorar a experiência de navegação. Nenhum dado pessoal sensível é coletado sem o seu consentimento.
                  </p>
                </div>
              </>
            )}

            {activeModal === 'terms' && (
              <>
                <h3 id="legal-modal-heading" className="legal-modal-title">
                  Termos de Uso
                </h3>
                <div className="legal-modal-body">
                  <p>
                    Esta página reúne links oficiais e conteúdos de Georgia Bachi (Nutricionista e Escritora), incluindo seus livros na Amazon, canal do YouTube, perfil no Instagram e eventuais cupons de desconto de marcas parceiras.
                  </p>
                  <p>
                    As condições comerciais, preços, prazos de entrega e aplicação de descontos são de responsabilidade exclusiva da loja oficial de destino.
                  </p>
                </div>
              </>
            )}

            <button
              type="button"
              className="legal-modal-btn"
              onClick={() => setActiveModal(null)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
