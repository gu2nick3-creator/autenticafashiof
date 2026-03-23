import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import heroImage from '@/assets/hero-collection.jpg';
import scarpinValentina from '@/assets/products/scarpin-valentina.jpg';
import tenisIsabella from '@/assets/products/tenis-isabella.jpg';
import sandaliaSophia from '@/assets/products/sandalia-sophia.jpg';
import botaMilena from '@/assets/products/bota-milena.jpg';
import { Truck, CreditCard, Store, Star, MessageCircle, ArrowRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { CarouselApi } from '@/components/ui/carousel';
import { useStore } from '@/contexts/StoreContext';
import { SITE_PHONE_RAW, SITE_FACEBOOK } from '@/lib/site-config';

export default function Home() {
  const [email, setEmail] = useState('');
  const [heroCarouselApi, setHeroCarouselApi] = useState<CarouselApi>();
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const { products } = useStore();

  const activeProducts = useMemo(() => products.filter(p => p.active), [products]);
  const featured = activeProducts.filter(p => p.featured);
  const newProducts = activeProducts.filter(p => p.isNew);
  const saleProducts = activeProducts.filter(p => p.onSale);
  const bestSellers = activeProducts.filter(p => p.bestSeller);
  const heroProducts = featured.length ? featured.slice(0, 5) : activeProducts.slice(0, 5);
  const heroSlides = heroProducts.length
    ? heroProducts.map((product) => ({
        id: product.id,
        title: product.name,
        subtitle: product.shortDescription || 'Estilo e conforto para todos os momentos.',
        image: product.images[0] || heroImage,
        href: `/produto/${product.slug}`,
      }))
    : [
        {
          id: 'banner-1',
          title: 'Nova coleção',
          subtitle: 'Modelos que valorizam seu estilo em qualquer ocasião.',
          image: heroImage,
          href: '/loja',
        },
        {
          id: 'banner-2',
          title: 'Scarpins e elegância',
          subtitle: 'Peças marcantes para montar looks sofisticados.',
          image: scarpinValentina,
          href: '/loja',
        },
        {
          id: 'banner-3',
          title: 'Tênis e conforto',
          subtitle: 'Opções casuais para o dia a dia com muito estilo.',
          image: tenisIsabella,
          href: '/loja',
        },
        {
          id: 'banner-4',
          title: 'Sandálias e botas',
          subtitle: 'Versatilidade para compor a vitrine da sua marca.',
          image: sandaliaSophia || botaMilena,
          href: '/loja',
        },
      ];
  const categories = [...new Set(activeProducts.map(p => p.category))];
  const testimonials = [
    { id: '1', name: 'Carolina M.', text: 'A qualidade e o acabamento são impecáveis. Atendimento muito bom também.', rating: 5 },
    { id: '2', name: 'Fernanda L.', text: 'Site bonito, compra fácil e produtos maravilhosos. Recomendo.', rating: 5 },
    { id: '3', name: 'Beatriz S.', text: 'Comprei para presentear e chegou tudo certinho. Excelente experiência.', rating: 5 },
    { id: '4', name: 'Amanda R.', text: 'Peças lindas e muito confortáveis. Já quero comprar de novo.', rating: 4 },
  ];

  useEffect(() => {
    if (!heroCarouselApi) return;
    const updateIndex = () => setCurrentHeroIndex(heroCarouselApi.selectedScrollSnap());
    updateIndex();
    heroCarouselApi.on('select', updateIndex);
    heroCarouselApi.on('reInit', updateIndex);
    const interval = window.setInterval(() => {
      const lastIndex = heroSlides.length - 1;
      if (heroCarouselApi.selectedScrollSnap() >= lastIndex) heroCarouselApi.scrollTo(0);
      else heroCarouselApi.scrollNext();
    }, 3500);
    return () => {
      window.clearInterval(interval);
      heroCarouselApi.off('select', updateIndex);
    };
  }, [heroCarouselApi, heroSlides.length]);

  return (
    <div>
      <section className="relative isolate overflow-hidden bg-cream">
        <Carousel setApi={setHeroCarouselApi} opts={{ align: 'start', loop: true }} className="absolute inset-0 h-full w-full">
          <CarouselContent className="ml-0 h-full">
            {heroSlides.map((slide) => (
              <CarouselItem key={slide.id} className="pl-0 basis-full h-full">
                <Link to={slide.href} className="block h-full w-full" aria-label={`Abrir destaque ${slide.title}`}>
                  <div className="relative h-full min-h-[540px] md:min-h-[720px] w-full overflow-hidden bg-[#f4efe8]">
                    <img src={slide.image} alt={slide.title} className="h-full w-full object-cover object-center" />
                    <div className="absolute inset-0 bg-black/30 md:bg-gradient-to-r md:from-black/40 md:via-black/18 md:to-black/28" />
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/35 to-transparent md:h-48" />
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="relative z-10 container flex min-h-[540px] md:min-h-[720px] items-center justify-center py-16 md:justify-start md:py-24">
          <ScrollReveal>
            <div className="mx-auto flex max-w-[330px] flex-col items-center text-center text-white md:mx-0 md:max-w-2xl md:items-start md:text-left">
              <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.45em] text-white/80 md:text-xs">Vitrine em destaque</p>
              <h2 className="font-display text-4xl font-semibold uppercase tracking-[0.18em] md:text-6xl lg:text-7xl">Autêntica</h2>
              <p className="mt-4 max-w-xl text-lg font-light leading-relaxed text-white/90 md:text-2xl">Estilo e Conforto para Todos os Momentos.</p>
              <Link to="/loja" className="mt-8 inline-flex min-h-12 items-center justify-center bg-[#E2A12A] px-8 text-base font-medium text-white transition-opacity hover:opacity-90 md:px-10 md:text-lg">Ver Coleção</Link>
            </div>
          </ScrollReveal>
        </div>

        {heroSlides.length > 1 && (
          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2 md:left-10 md:translate-x-0">
            {heroSlides.map((_, index) => (
              <button key={index} onClick={() => heroCarouselApi?.scrollTo(index)} className={`h-2.5 rounded-full transition-all ${currentHeroIndex === index ? 'w-8 bg-white' : 'w-2.5 bg-white/45'}`} aria-label={`Ir para banner ${index + 1}`} />
            ))}
          </div>
        )}
      </section>

      <section className="border-b border-border py-5 md:py-6 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
            {[
              { icon: Truck, text: 'Enviamos para todo Brasil' },
              { icon: CreditCard, text: 'Parcelamentos em até 6x sem juros' },
              { icon: Store, text: 'Compre para revenda - saiba mais', to: '/revenda' },
            ].map((item, i) => {
              const content = <div className="flex items-center justify-center gap-3 rounded-none border border-border px-4 py-4 text-center md:justify-start md:text-left h-full bg-cream/30 hover:bg-cream/50 transition-colors"><item.icon className="w-5 h-5 text-gold flex-shrink-0" /><p className="text-xs md:text-sm font-body font-semibold leading-relaxed">{item.text}</p></div>;
              return item.to ? <Link key={i} to={item.to} className="block">{content}</Link> : <div key={i}>{content}</div>;
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <ScrollReveal><div className="text-center mb-12"><p className="text-xs tracking-wide-luxury uppercase font-body text-gold mb-3">Acabou de Chegar</p><h2 className="font-display text-3xl md:text-4xl font-light">Novidades</h2></div></ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">{newProducts.map((product, i) => <ScrollReveal key={product.id} delay={i * 0.08}><ProductCard product={product} /></ScrollReveal>)}</div>
          <div className="text-center mt-10"><Button variant="premium-outline" size="lg" asChild><Link to="/loja?filter=new">Ver Todas as Novidades <ArrowRight className="w-4 h-4" /></Link></Button></div>
        </div>
      </section>

      <section className="py-16 bg-cream">
        <div className="container">
          <ScrollReveal><div className="text-center mb-12"><p className="text-xs tracking-wide-luxury uppercase font-body text-gold mb-3">Categorias</p><h2 className="font-display text-3xl md:text-4xl font-light">Compre por Estilo</h2></div></ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(0, 4).map((cat, i) => {
              const categoryProduct = activeProducts.find(product => product.category === cat);
              return (
                <ScrollReveal key={cat} delay={i * 0.08}>
                  <Link to={`/loja?category=${cat}`} className="group block relative aspect-[4/5] overflow-hidden bg-foreground/5">
                    <img src={categoryProduct?.images[0] || heroImage} alt={cat} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                    <div className="absolute inset-0 flex items-end p-6"><span className="text-white font-display text-xl md:text-2xl font-medium">{cat}</span></div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24"><div className="container"><ScrollReveal><div className="text-center mb-12"><p className="text-xs tracking-wide-luxury uppercase font-body text-gold mb-3">Top de Vendas</p><h2 className="font-display text-3xl md:text-4xl font-light">Mais Vendidos</h2></div></ScrollReveal><div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">{bestSellers.map((product, i) => <ScrollReveal key={product.id} delay={i * 0.08}><ProductCard product={product} /></ScrollReveal>)}</div></div></section>
      <section className="bg-primary text-primary-foreground py-16 md:py-24"><div className="container text-center"><ScrollReveal><p className="text-xs tracking-wide-luxury uppercase font-body text-gold mb-4">Promoção Especial</p><h2 className="font-display text-3xl md:text-5xl font-light mb-4">Até 30% Off</h2><p className="text-primary-foreground/60 font-body text-sm max-w-md mx-auto mb-8">Peças selecionadas com descontos exclusivos. Aproveite enquanto duram os estoques.</p><Button variant="gold" size="xl" asChild><Link to="/loja?filter=sale">Ver Promoções</Link></Button></ScrollReveal></div></section>
      <section className="py-16 md:py-24"><div className="container"><ScrollReveal><div className="text-center mb-12"><p className="text-xs tracking-wide-luxury uppercase font-body text-gold mb-3">Ofertas</p><h2 className="font-display text-3xl md:text-4xl font-light">Em Promoção</h2></div></ScrollReveal><div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">{saleProducts.map((product, i) => <ScrollReveal key={product.id} delay={i * 0.08}><ProductCard product={product} /></ScrollReveal>)}</div></div></section>

      <section className="py-16 bg-cream"><div className="container"><ScrollReveal><div className="text-center mb-12"><p className="text-xs tracking-wide-luxury uppercase font-body text-gold mb-3">Depoimentos</p><h2 className="font-display text-3xl md:text-4xl font-light">O Que Dizem Nossas Clientes</h2></div></ScrollReveal><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">{testimonials.map((t, i) => <ScrollReveal key={t.id} delay={i * 0.08}><div className="bg-background p-6 border border-border"><div className="flex gap-0.5 mb-4">{Array.from({ length: t.rating }).map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-gold text-gold" />)}</div><p className="text-sm font-body text-foreground/80 leading-relaxed mb-4">&quot;{t.text}&quot;</p><p className="font-display text-lg">{t.name}</p></div></ScrollReveal>)}</div></div></section>

      <section className="py-16 md:py-24"><div className="container"><div className="grid md:grid-cols-2 gap-8 items-center bg-cream/40 p-8 md:p-12 border border-border"><ScrollReveal direction="left"><div><p className="text-xs tracking-wide-luxury uppercase font-body text-gold mb-3">Atendimento</p><h2 className="font-display text-3xl md:text-4xl font-light mb-4">Compre com atendimento direto</h2><p className="text-sm text-muted-foreground font-body leading-relaxed mb-6">Fale no WhatsApp para dúvidas, revenda, pedidos e suporte.</p><Button variant="premium" asChild><a href={`https://wa.me/${SITE_PHONE_RAW}`} target="_blank" rel="noreferrer"><MessageCircle className="w-4 h-4" /> Chamar no WhatsApp</a></Button></div></ScrollReveal><ScrollReveal direction="right"><div className="space-y-4"><a href={SITE_FACEBOOK} target="_blank" rel="noreferrer" className="block border border-border bg-background p-5 hover:border-gold transition-colors"><p className="text-sm font-body font-semibold">Siga também no Facebook</p><p className="text-sm text-muted-foreground font-body mt-1">Veja novidades, lançamentos e contato rápido.</p></a><div className="border border-border bg-background p-5"><p className="text-sm font-body font-semibold">Receba novidades</p><div className="mt-3 flex gap-2"><input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Seu e-mail" className="h-11 flex-1 border border-border bg-background px-4 text-sm outline-none" /><Button variant="premium-outline" onClick={() => setEmail('')}>Enviar</Button></div></div></div></ScrollReveal></div></div></section>
    </div>
  );
}
