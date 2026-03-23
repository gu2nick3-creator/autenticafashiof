import { ScrollReveal } from '@/components/ScrollReveal';

export default function Terms() {
  return (
    <div className="py-8 md:py-12">
      <div className="container max-w-3xl">
        <ScrollReveal>
          <h1 className="font-display text-3xl md:text-4xl font-light mb-8">Termos de Uso</h1>
        </ScrollReveal>
        <div className="space-y-6 text-sm font-body text-foreground/80 leading-relaxed">
          <ScrollReveal delay={0.05}>
            <p>Ao utilizar o site da Autêntica FashionF, você concorda com os termos descritos abaixo.</p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="font-display text-xl font-medium text-foreground mb-2">Uso do site</h2>
            <p>O site destina-se à compra de calçados femininos. É proibido o uso para fins ilegais, fraudulentos ou que violem direitos de terceiros.</p>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <h2 className="font-display text-xl font-medium text-foreground mb-2">Preços e disponibilidade</h2>
            <p>Os preços podem ser alterados sem aviso prévio. A disponibilidade dos produtos está sujeita ao estoque. Em caso de indisponibilidade após a compra, o cliente será notificado e reembolsado.</p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <h2 className="font-display text-xl font-medium text-foreground mb-2">Propriedade intelectual</h2>
            <p>Todo conteúdo do site, incluindo textos, imagens, logos e design, é propriedade da Autêntica FashionF e protegido por leis de propriedade intelectual.</p>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
