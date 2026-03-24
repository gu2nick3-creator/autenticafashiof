import { ScrollReveal } from '@/components/ScrollReveal';
import heroImage from '@/assets/hero-collection.jpg';

export default function About() {
  return (
    <div className="py-8 md:py-12"><div className="container"><div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"><ScrollReveal direction="left"><div className="aspect-[4/5] overflow-hidden bg-cream"><img src={heroImage} alt="Sobre a Autêntica Fashion" className="w-full h-full object-cover" /></div></ScrollReveal><ScrollReveal direction="right"><div><p className="text-xs tracking-luxury uppercase font-body font-semibold text-gold mb-3">Sobre a marca</p><h1 className="font-display text-3xl md:text-4xl font-light mb-5">Autêntica Fashion</h1><p className="text-sm md:text-base text-muted-foreground font-body leading-relaxed mb-4">Criamos uma experiência de compra mais elegante, simples e prática para quem busca estilo com conforto. Nosso foco é unir produtos bonitos, atendimento humanizado e uma apresentação de loja profissional.</p><p className="text-sm md:text-base text-muted-foreground font-body leading-relaxed mb-4">A loja foi estruturada para crescer com catálogo editável, área de revenda, painel administrativo e organização dos pedidos, mantendo o visual clean e moderno.</p><p className="text-sm md:text-base text-muted-foreground font-body leading-relaxed">Aqui cada detalhe foi pensado para valorizar a marca e facilitar a decisão de compra das clientes.</p></div></ScrollReveal></div></div></div>
  );
}
