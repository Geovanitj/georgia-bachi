import React from 'react';
import { StoreInfo } from '@/lib/supabase';
import { StoreCard } from './StoreCard';

interface InstabioViewProps {
  store?: StoreInfo | null;
  showStoreCard?: boolean;
}

export function InstabioView({ store, showStoreCard = true }: InstabioViewProps) {
  return (
    <>
      <section className="instabio-section">
        <div className="instabio-overlay" />
        <div className="instabio-container">
          {/* Nome / Título */}
          <div className="instabio-title-wrap">
            <h1 className="instabio-title">GEORGIA BACHI</h1>
          </div>

          {/* Subtítulo */}
          <div className="instabio-subtitle-wrap">
            <p>
              SAÚDE, MATERNIDADE E <span className="instabio-subtitle-highlight">AUTOCUIDADO</span>
            </p>
          </div>

          {/* 1. Card Dinâmico de Cupom (Apenas em rotas de parceiros/lojas) */}
          {showStoreCard && store && <StoreCard store={store} />}

          {/* 2. Livro 1 - Dieta com Whey Protein */}
          <div className="instabio-card">
            <a
              href="https://share.google/owEwOCKH9DVGxq7XM"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                decoding="async"
                width={1376}
                height={768}
                src="/assets/img/livro-dieta-whey-protein.jpg"
                alt="Livro Dieta com Whey Protein - Georgia Bachi | Amazon"
              />
            </a>
          </div>

          {/* 3. Livro 2 - Nutrição muito além da alimentação */}
          <div className="instabio-card">
            <a
              href="https://share.google/ob3URqkhsxMU9v6ZY"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                loading="lazy"
                decoding="async"
                width={1376}
                height={768}
                src="/assets/img/livro-nutricao-alem-da-alimentacao.jpg"
                alt="Livro Nutrição muito além da alimentação - Georgia Bachi | Amazon"
              />
            </a>
          </div>

          {/* 4. Canal no YouTube */}
          <div className="instabio-card">
            <a
              href="https://youtube.com/@georgiabachi?si=7XKMUK6xe_bGDN53"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                loading="lazy"
                decoding="async"
                width={1376}
                height={768}
                src="/assets/img/canal-youtube-georgia.jpg"
                alt="Canal no YouTube - Georgia Bachi"
              />
            </a>
          </div>

          {/* 5. Instagram (@georgiabachi) */}
          <div className="instabio-card">
            <a
              href="https://www.instagram.com/georgiabachi/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                loading="lazy"
                decoding="async"
                width={1376}
                height={768}
                src="/assets/img/instagram-georgia.jpg"
                alt="Instagram @georgiabachi - Siga no Instagram"
              />
            </a>
          </div>
        </div>
      </section>

      {/* Rodapé / Espaçador Mobile */}
      <div className="instabio-bottom-spacer" />
    </>
  );
}
