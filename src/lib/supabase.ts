import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://amyyukdkikjtknscrsqh.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFteXl1a2RraWtqdGtuc2Nyc3FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzNjQwOTEsImV4cCI6MjEwMDk0MDA5MX0.t8zARnmHVpj6oKMjG_TOjhrUTmOEbjI3xfkyJpdeWZw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface StoreInfo {
  nome: string;
  slug: string;
  subtitulo: string;
  cupom: string;
  link: string;
  acao: 'copiar_cupom' | 'link';
  logo?: string | null;
}

/**
 * Busca a loja e o cupom de desconto 100% dinâmico no Supabase.
 * Tabelas: 'lojas' e 'coupons'
 */
export async function getStoreData(slugParam?: string): Promise<StoreInfo | null> {
  if (!slugParam) return null;
  const normalizedSlug = slugParam.toLowerCase().trim();

  try {
    // 1. Busca a loja pelo slug na tabela 'lojas'
    const { data: loja, error: lojaError } = await supabase
      .from('lojas')
      .select('*')
      .eq('slug', normalizedSlug)
      .maybeSingle();

    if (lojaError || !loja) {
      if (lojaError) {
        console.error(`Erro ao buscar loja "${normalizedSlug}" no Supabase:`, lojaError);
      }
      return null;
    }

    // 2. Busca os cupons ativos dessa loja na tabela 'coupons'
    const { data: coupons, error: couponError } = await supabase
      .from('coupons')
      .select('*')
      .eq('loja_id', loja.id)
      .eq('active', true)
      .order('priority', { ascending: false });

    if (couponError) {
      console.error(`Erro ao buscar cupons para "${normalizedSlug}":`, couponError);
    }

    // Encontra o primeiro cupom ativo válido que tenha um código
    const validCoupon = (coupons || []).find((c) => c.code && c.code.trim().length > 0);

    const cupomCode = validCoupon?.code || (loja as any)?.cupom || (loja as any)?.coupon || '';
    if (!cupomCode) {
      console.warn(`Loja "${normalizedSlug}" encontrada no Supabase, mas sem cupom ativo com código.`);
      return null;
    }

    const subtitulo =
      (validCoupon?.discount ? validCoupon.discount.toUpperCase() : null) ||
      loja.description ||
      'CUPOM DE DESCONTO EXCLUSIVO';

    const linkUrl = validCoupon?.url || loja.site_url || (loja as any)?.link || '#';

    // Captura a logo de qualquer coluna comum no Supabase
    const logoUrl =
      (loja as any)?.logo_url ||
      (loja as any)?.logo ||
      (loja as any)?.image_url ||
      (loja as any)?.brand_logo ||
      (validCoupon as any)?.logo_url ||
      (validCoupon as any)?.logo ||
      (validCoupon as any)?.image_url ||
      null;

    return {
      nome: loja.name || normalizedSlug,
      slug: loja.slug || normalizedSlug,
      subtitulo: subtitulo,
      cupom: cupomCode,
      link: linkUrl,
      acao: 'copiar_cupom',
      logo: logoUrl
    };
  } catch (error) {
    console.error(`Erro ao carregar dados do Supabase para ${normalizedSlug}:`, error);
    return null;
  }
}
