import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Georgia Bachi | Saúde, maternidade e autocuidado',
  description: 'Georgia Bachi - Nutricionista e Escritora. Saúde, maternidade e autocuidado.',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    locale: 'pt_BR',
    type: 'website',
    title: 'Georgia Bachi | Saúde, maternidade e autocuidado',
    description: 'Nutricionista e Escritora - Saúde, maternidade e autocuidado',
    siteName: 'Georgia Bachi',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Georgia Bachi | Saúde, maternidade e autocuidado',
    description: 'Nutricionista e Escritora - Saúde, maternidade e autocuidado',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700;900&family=Roboto:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

