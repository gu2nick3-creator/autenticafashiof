import { ScrollReveal } from '@/components/ScrollReveal';

export default function Privacy() {
  return (
    <div className="py-8 md:py-12">
      <div className="container max-w-3xl">
        <ScrollReveal>
          <h1 className="font-display text-3xl md:text-4xl font-light mb-8">Política de Privacidade</h1>
        </ScrollReveal>
        <div className="space-y-6 text-sm font-body text-foreground/80 leading-relaxed">
          <ScrollReveal delay={0.05}>
            <p>A Autêntica FashionF valoriza a privacidade de seus clientes. Esta política descreve como coletamos, usamos e protegemos suas informações pessoais.</p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="font-display text-xl font-medium text-foreground mb-2">Dados coletados</h2>
            <p>Coletamos dados necessários para processar pedidos: nome, e-mail, telefone, endereço e dados de pagamento. Informações de navegação podem ser coletadas via cookies.</p>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <h2 className="font-display text-xl font-medium text-foreground mb-2">Uso dos dados</h2>
            <p>Seus dados são utilizados exclusivamente para processar pedidos, melhorar sua experiência de compra, enviar comunicações sobre pedidos e, com seu consentimento, novidades e promoções.</p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <h2 className="font-display text-xl font-medium text-foreground mb-2">Segurança</h2>
            <p>Utilizamos tecnologias de criptografia e segurança de dados padrão do mercado para proteger suas informações pessoais e financeiras.</p>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
