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
}

export const FALLBACK_LOJAS: Record<string, StoreInfo> = {
  gocase: {
    nome: "Gocase",
    slug: "gocase",
    subtitulo: "ESTILO E PRATICIDADE NA SUA ROTINA",
    cupom: "MAISROTINA",
    link: "https://www.gocase.com.br",
    acao: "copiar_cupom"
  },
  gshield: {
    nome: "Gshield",
    slug: "gshield",
    subtitulo: "PROTEÇÃO E TECNOLOGIA PARA SEU DIA A DIA",
    cupom: "ROTINA",
    link: "https://www.gorilashield.com.br/",
    acao: "copiar_cupom"
  }
};

/**
 * Busca a loja e o cupom de desconto real no Supabase.
 * Tabelas: 'lojas' e 'coupons'
 */
export async function getStoreData(slugParam?: string): Promise<StoreInfo> {
  const normalizedSlug = (slugParam || 'gocase').toLowerCase().trim();
  const defaultFallback = FALLBACK_LOJAS[normalizedSlug] || FALLBACK_LOJAS.gocase;

  try {
    // 1. Busca a loja pelo slug na tabela 'lojas'
    const { data: loja, error: lojaError } = await supabase
      .from('lojas')
      .select('id, name, slug, site_url, description')
      .eq('slug', normalizedSlug)
      .maybeSingle();

    if (lojaError || !loja) {
      return defaultFallback;
    }

    // 2. Busca os cupons ativos dessa loja na tabela 'coupons'
    const { data: coupons, error: couponError } = await supabase
      .from('coupons')
      .select('code, discount, description, url, active')
      .eq('loja_id', loja.id)
      .eq('active', true)
      .order('priority', { ascending: false });

    // Encontra o primeiro cupom válido que tenha um código (não vazio)
    const validCoupon = (coupons || []).find((c) => c.code && c.code.trim().length > 0);

    const cupomCode = validCoupon?.code || defaultFallback.cupom;
    const subtitulo =
      (validCoupon?.discount ? validCoupon.discount.toUpperCase() : null) ||
      defaultFallback.subtitulo;
    const linkUrl = validCoupon?.url || loja.site_url || defaultFallback.link;

    return {
      nome: loja.name || defaultFallback.nome,
      slug: loja.slug || normalizedSlug,
      subtitulo: subtitulo,
      cupom: cupomCode,
      link: linkUrl,
      acao: 'copiar_cupom'
    };
  } catch (error) {
    console.error(`Erro ao carregar dados do Supabase para ${normalizedSlug}:`, error);
    return defaultFallback;
  }
}
