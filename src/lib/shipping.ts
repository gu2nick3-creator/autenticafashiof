import { Address } from '@/types';

const REGION_BY_STATE: Record<string, { region: string; base: number }> = {
  AC: { region: 'Norte', base: 34.9 }, AL: { region: 'Nordeste', base: 21.9 }, AP: { region: 'Norte', base: 36.9 },
  AM: { region: 'Norte', base: 38.9 }, BA: { region: 'Nordeste', base: 23.9 }, CE: { region: 'Nordeste', base: 20.9 },
  DF: { region: 'Centro-Oeste', base: 22.9 }, ES: { region: 'Sudeste', base: 20.9 }, GO: { region: 'Centro-Oeste', base: 22.9 },
  MA: { region: 'Nordeste', base: 24.9 }, MT: { region: 'Centro-Oeste', base: 24.9 }, MS: { region: 'Centro-Oeste', base: 23.9 },
  MG: { region: 'Sudeste', base: 18.9 }, PA: { region: 'Norte', base: 34.9 }, PB: { region: 'Nordeste', base: 18.9 },
  PR: { region: 'Sul', base: 18.9 }, PE: { region: 'Nordeste', base: 19.9 }, PI: { region: 'Nordeste', base: 22.9 },
  RJ: { region: 'Sudeste', base: 19.9 }, RN: { region: 'Nordeste', base: 20.9 }, RO: { region: 'Norte', base: 33.9 },
  RR: { region: 'Norte', base: 38.9 }, RS: { region: 'Sul', base: 20.9 }, SC: { region: 'Sul', base: 18.9 },
  SP: { region: 'Sudeste', base: 17.9 }, SE: { region: 'Nordeste', base: 21.9 }, TO: { region: 'Norte', base: 29.9 },
};

const CAPITALS = new Set([
  'rio branco','maceió','macapa','macapá','manaus','salvador','fortaleza','brasilia','brasília','vitoria','vitória','goiania','goiânia','sao luis','são luís','cuiaba','cuiabá','campo grande','belo horizonte','belem','belém','joao pessoa','joão pessoa','curitiba','recife','teresina','rio de janeiro','natal','porto velho','boa vista','porto alegre','florianopolis','florianópolis','sao paulo','são paulo','aracaju','palmas'
]);

export function calculateShipping(address?: Partial<Address>, subtotal = 0) {
  if (!address?.state) return { amount: subtotal >= 299 ? 0 : 19.9, region: '', label: 'Frete padrão' };

  const state = address.state.trim().toUpperCase();
  const entry = REGION_BY_STATE[state] ?? { region: 'Brasil', base: 24.9 };
  const city = (address.city || '').trim().toLowerCase();
  let amount = entry.base;

  if (CAPITALS.has(city)) amount -= 3;
  if (subtotal >= 299) amount = Math.max(0, amount - 8);
  if (subtotal >= 499) amount = 0;

  return {
    amount: Number(amount.toFixed(2)),
    region: entry.region,
    label: amount === 0 ? 'Frete grátis' : `Frete para ${address.city || 'sua cidade'} - ${entry.region}`,
  };
}
