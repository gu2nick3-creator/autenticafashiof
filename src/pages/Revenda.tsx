import { Link } from 'react-router-dom';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Button } from '@/components/ui/button';
import { BadgePercent, PackageCheck, CreditCard, MessageCircle, Truck } from 'lucide-react';

export default function Revenda() {
  const whatsappNumber = '5583999618968';
  const whatsappMessage = encodeURIComponent('Olá! Quero saber mais sobre compra para revenda.');

  return (
    <div className="py-8 md:py-12">
      <div className="container max-w-5xl">
        <ScrollReveal>
          <div className="text-center mb-12 md:mb-16">
            <p className="text-xs tracking-wide-luxury uppercase font-body text-gold mb-3">Parceria</p>
            <h1 className="font-display text-3xl md:text-5xl font-light mb-4">Compre para Revenda</h1>
            <p className="max-w-2xl mx-auto text-sm md:text-base text-muted-foreground font-body leading-relaxed">
              Trabalhe com a Autêntica FashionF e tenha acesso a calçados femininos com ótimo giro, visual elegante e condições especiais para quem deseja revender.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.05}>
          <div className="grid gap-4 md:grid-cols-3 mb-12">
            {[
              {
                icon: BadgePercent,
                title: 'Condições especiais',
                text: 'Atendimento para quem deseja comprar em maior volume e revender com mais margem.',
              },
              {
                icon: PackageCheck,
                title: 'Modelos selecionados',
                text: 'Peças com estilo, conforto e apelo de venda para diferentes perfis de cliente.',
              },
              {
                icon: Truck,
                title: 'Envio para todo Brasil',
                text: 'Despachamos seus pedidos com praticidade para atender sua revenda onde você estiver.',
              },
            ].map((item) => (
              <div key={item.title} className="border border-border bg-background p-6 md:p-7">
                <div className="w-12 h-12 bg-cream flex items-center justify-center mb-5">
                  <item.icon className="w-5 h-5 text-gold" />
                </div>
                <h2 className="font-display text-2xl font-light mb-3">{item.title}</h2>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <div className="grid gap-8 md:grid-cols-[1.15fr_0.85fr] items-start">
          <ScrollReveal direction="left" delay={0.1}>
            <div className="border border-border bg-cream/30 p-6 md:p-8">
              <h2 className="font-display text-2xl md:text-3xl font-light mb-5">Como funciona a revenda</h2>
              <div className="space-y-4 text-sm md:text-base text-foreground/80 font-body leading-relaxed">
                <p>
                  Se você quer comprar para revender, fale com a nossa equipe para receber mais informações sobre disponibilidade, quantidades e condições comerciais.
                </p>
                <p>
                  A proposta é simples: você entra em contato, entendemos o seu perfil de compra e mostramos as melhores possibilidades para começar ou ampliar sua revenda.
                </p>
                <p>
                  Nosso atendimento é direto e rápido para facilitar sua negociação e te ajudar a escolher os modelos certos para o seu público.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.15}>
            <div className="border border-border bg-background p-6 md:p-8">
              <div className="w-14 h-14 bg-cream flex items-center justify-center mb-6">
                <MessageCircle className="w-6 h-6 text-gold" />
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-light mb-3">Solicite atendimento</h2>
              <p className="text-sm text-muted-foreground font-body leading-relaxed mb-6">
                Quer saber mais sobre compra para revenda? Chame no WhatsApp e fale com a nossa equipe.
              </p>

              <div className="space-y-3 text-sm font-body mb-8">
                <div className="flex items-center gap-3"><CreditCard className="w-4 h-4 text-gold" /><span>Parcelamentos em até 6x sem juros</span></div>
                <div className="flex items-center gap-3"><Truck className="w-4 h-4 text-gold" /><span>Enviamos para todo Brasil</span></div>
                <div className="flex items-center gap-3"><MessageCircle className="w-4 h-4 text-gold" /><span>Atendimento rápido pelo WhatsApp</span></div>
              </div>

              <div className="flex flex-col gap-3">
                <Button variant="gold" size="xl" asChild>
                  <a href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`} target="_blank" rel="noreferrer">
                    Saiba Mais no WhatsApp
                  </a>
                </Button>
                <Button variant="premium-outline" size="lg" asChild>
                  <Link to="/loja">Ver Produtos</Link>
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
