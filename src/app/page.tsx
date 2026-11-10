import { getStoreData } from '@/lib/supabase';
import { InstabioView } from '@/components/InstabioView';

export const revalidate = 60;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ loja?: string; store?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const lojaParam = resolvedSearchParams?.loja || resolvedSearchParams?.store;

  // Se o usuário passou um parâmetro explícito (?loja=gocase), exibe o card da loja
  if (lojaParam) {
    const store = await getStoreData(lojaParam);
    return <InstabioView store={store} showStoreCard={true} />;
  }

  // Na Home padrão (/), exibe apenas os cards institucionais (livros, YouTube, Instagram) sem o card de cupom
  return <InstabioView showStoreCard={false} />;
}
