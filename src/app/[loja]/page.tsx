import { Metadata } from 'next';
import { getStoreData } from '@/lib/supabase';
import { InstabioView } from '@/components/InstabioView';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ loja: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { loja } = await params;
  const store = await getStoreData(loja);

  return {
    title: `Georgia Bachi | ${store.nome}`,
    description: `Aproveite o cupom exclusivo da ${store.nome}: ${store.cupom}. Georgia Bachi - Saúde, maternidade e autocuidado.`,
  };
}

export default async function StorePage({ params }: PageProps) {
  const { loja } = await params;
  const store = await getStoreData(loja);

  return <InstabioView store={store} showStoreCard={true} />;
}
