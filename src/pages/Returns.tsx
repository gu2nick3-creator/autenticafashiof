import { ScrollReveal } from '@/components/ScrollReveal';
import { SITE_PHONE_DISPLAY } from '@/lib/site-config';

export default function Returns() {
  return (
    <div className="py-8 md:py-12"><div className="container max-w-4xl"><ScrollReveal><h1 className="font-display text-3xl md:text-4xl font-light mb-8">Trocas e Devoluções</h1><div className="prose prose-neutral max-w-none font-body"><p>Você pode solicitar troca ou devolução em até 7 dias corridos após o recebimento do pedido, conforme as condições do produto.</p><p>Entre em contato pelo WhatsApp {SITE_PHONE_DISPLAY} informando o número do pedido e o motivo da solicitação. Nossa equipe retornará com as orientações.</p><p>Produtos devem ser devolvidos sem sinais de uso indevido e com embalagem adequada.</p></div></ScrollReveal></div></div>
  );
}
