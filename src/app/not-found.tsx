import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="instabio-section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="instabio-overlay" />
      <div className="instabio-container" style={{ textAlign: 'center', zIndex: 3 }}>
        <h1 className="instabio-title" style={{ fontSize: '36px', marginBottom: '20px' }}>PÁGINA NÃO ENCONTRADA</h1>
        <p style={{ color: '#C5D1CC', marginBottom: '30px' }}>A loja ou página que você procurou não foi encontrada.</p>
        <Link href="/" style={{ color: '#D4AF37', textDecoration: 'none', border: '1px solid #D4AF37', padding: '10px 24px', borderRadius: '50px' }}>
          Voltar para Georgia Bachi
        </Link>
      </div>
    </section>
  );
}

