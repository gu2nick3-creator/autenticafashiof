import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useStore } from '@/contexts/StoreContext';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/ScrollReveal';
import { ProductCard } from '@/components/ProductCard';
import { Heart, Minus, Plus, ShoppingBag, Truck, RotateCcw, ShieldCheck, Star, MessageCircle } from 'lucide-react';
import { SITE_PHONE_RAW } from '@/lib/site-config';

const BUNDLE_SLOTS = 10;

type PurchaseMode = 'varejo' | 'bundle';

export default function ProductPage() {
  const { slug } = useParams();
  const { products, addToCart, toggleFavorite, isFavorite } = useStore();
  const product = products.find((p) => p.slug === slug);
  const { currentCustomer } = useAuth();
  const [purchaseMode, setPurchaseMode] = useState<PurchaseMode>('varejo');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [bundleSizes, setBundleSizes] = useState<string[]>(Array.from({ length: BUNDLE_SLOTS }, () => ''));

  if (!product) {
    return <div className="container py-24 text-center"><h1 className="font-display text-3xl font-light mb-4">Produto não encontrado</h1><Button variant="premium" asChild><Link to="/loja">Voltar à Loja</Link></Button></div>;
  }

  const fav = isFavorite(product.id);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const displayPrice = product.salePrice || product.price;
  const bundlePrice = product.bundlePrice || (displayPrice * 10);
  const selectedColorName = selectedColor || product.colors[0]?.name || '';

  const bundleSummary = useMemo(() => {
    return bundleSizes.reduce<Record<string, number>>((acc, size) => {
      if (!size) return acc;
      acc[size] = (acc[size] || 0) + 1;
      return acc;
    }, {});
  }, [bundleSizes]);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart(product, selectedSize, selectedColorName, quantity);
  };

  const handleAddBundleToCart = () => {
    if (bundleSizes.some((size) => !size)) return;

    const groupedSizes = bundleSizes.reduce<Record<string, number>>((acc, size) => {
      acc[size] = (acc[size] || 0) + 1;
      return acc;
    }, {});

    Object.entries(groupedSizes).forEach(([size, qty]) => {
      addToCart(product, size, selectedColorName, qty);
    });
  };

  return (
    <div className="py-8 md:py-12">
      <div className="container">
        <nav className="mb-8 flex gap-2 text-xs font-body text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link to="/loja" className="hover:text-foreground">Loja</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid gap-8 md:grid-cols-2 md:gap-16">
          <ScrollReveal direction="left">
            <div>
              <div className="mb-4 aspect-[3/4] overflow-hidden bg-cream">
                <img src={product.images[selectedImage]} alt={product.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)} className={`h-20 w-16 bg-cream border-2 transition-colors ${i === selectedImage ? 'border-foreground' : 'border-transparent'}`}>
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div>
              <p className="mb-2 text-xs font-body uppercase tracking-wide-luxury text-gold">{product.category}</p>
              <h1 className="mb-4 font-display text-3xl font-light leading-tight md:text-4xl">{product.name}</h1>

              <div className="mb-6 flex items-center gap-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < Math.floor(product.rating) ? 'fill-gold text-gold' : 'text-border'}`} />
                  ))}
                </div>
                <span className="text-xs font-body text-muted-foreground">({product.reviewCount} avaliações)</span>
              </div>

              <div className="mb-6">
                {product.salePrice ? (
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-2xl font-semibold text-gold">R$ {product.salePrice.toFixed(2).replace('.', ',')}</span>
                    <span className="font-body text-sm text-muted-foreground line-through">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                  </div>
                ) : (
                  <span className="font-display text-2xl font-semibold">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                )}
                <p className="mt-1 text-xs font-body text-muted-foreground">ou 6x de R$ {(displayPrice / 6).toFixed(2).replace('.', ',')} sem juros</p>
              </div>

              <p className="mb-8 text-sm font-body leading-relaxed text-foreground/80">{product.shortDescription}</p>

              <div className="mb-8 rounded-3xl border border-border bg-muted/30 p-5">
                <div className="mb-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => setPurchaseMode('varejo')}
                    className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-luxury transition-colors ${purchaseMode === 'varejo' ? 'bg-foreground text-background' : 'border border-border bg-background text-foreground'}`}
                  >
                    Comprar varejo
                  </button>
                  <button
                    onClick={() => setPurchaseMode('bundle')}
                    className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-luxury transition-colors ${purchaseMode === 'bundle' ? 'bg-foreground text-background' : 'border border-border bg-background text-foreground'}`}
                  >
                    Pedido 10 pares
                  </button>
                </div>

                {purchaseMode === 'varejo' ? (
                  currentCustomer ? (
                    <>
                      <p className="text-xs font-body font-semibold uppercase tracking-luxury text-muted-foreground mb-2">Compra unitária</p>
                      <p className="text-lg font-display font-light">Preço varejo: <span className="font-semibold">R$ {displayPrice.toFixed(2).replace('.', ',')}</span></p>
                      <p className="mt-2 text-sm text-muted-foreground font-body">Escolha tamanho e quantidade normalmente para comprar no varejo.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground font-body mb-4">Faça login ou registre-se para visualizar o preço do produto.</p>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" asChild><Link to="/login">Faça login</Link></Button>
                        <Button variant="premium-outline" asChild><Link to="/cadastro">Criar conta</Link></Button>
                      </div>
                    </>
                  )
                ) : currentCustomer ? (
                  <>
                    <p className="text-xs font-body font-semibold uppercase tracking-luxury text-muted-foreground mb-2">Pedido com 10 pares</p>
                    <p className="text-xl font-display font-light">Preço do lote: <span className="font-semibold">R$ {bundlePrice.toFixed(2).replace('.', ',')}</span></p>
                    <p className="mt-2 text-sm text-muted-foreground font-body">Monte os 10 pares escolhendo os tamanhos abaixo.</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground font-body mb-4">Faça login para liberar o pedido com 10 pares e escolher os tamanhos de uma vez.</p>
                    <Button variant="outline" asChild><Link to="/login">Faça login</Link></Button>
                  </>
                )}
              </div>

              {product.colors.length > 0 && (
                <div className="mb-6">
                  <p className="mb-3 text-xs font-body font-semibold uppercase tracking-luxury">Cor</p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`h-8 w-8 rounded-full border-2 transition-all ${selectedColorName === c.name ? 'scale-110 border-foreground' : 'border-transparent'}`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground font-body">Cor selecionada: {selectedColorName || 'Nenhuma'}</p>
                </div>
              )}

              {purchaseMode === 'varejo' ? (
                currentCustomer ? (
                <>
                  <div className="mb-6">
                    <p className="mb-3 text-xs font-body font-semibold uppercase tracking-luxury">Tamanho</p>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((s) => (
                        <button key={s} onClick={() => setSelectedSize(s)} className={`h-10 w-12 border text-sm font-body transition-colors ${selectedSize === s ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:border-foreground'}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8">
                    <p className="mb-3 text-xs font-body font-semibold uppercase tracking-luxury">Quantidade</p>
                    <div className="flex w-fit items-center border border-border">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-accent"><Minus className="h-3.5 w-3.5" /></button>
                      <span className="w-12 text-center text-sm font-body">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)} className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-accent"><Plus className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>

                  <div className="mb-6 flex gap-3">
                    <Button variant="premium" size="xl" className="flex-1" onClick={handleAddToCart} disabled={!selectedSize}>
                      <ShoppingBag className="h-4 w-4" />Adicionar ao Carrinho
                    </Button>
                    <button onClick={() => toggleFavorite(product.id)} className={`flex h-14 w-14 items-center justify-center border transition-colors hover:bg-accent ${fav ? 'border-rose' : 'border-border'}`}><Heart className={`h-5 w-5 ${fav ? 'fill-rose text-rose' : ''}`} /></button>
                  </div>
                </>
                ) : (
                  <div className="mb-6 flex gap-3">
                    <Button variant="premium" size="xl" className="flex-1" asChild>
                      <Link to="/login">Entrar para ver o preço</Link>
                    </Button>
                    <Button variant="outline" size="xl" className="flex-1" asChild>
                      <Link to="/cadastro">Criar conta</Link>
                    </Button>
                  </div>
                )
              ) : currentCustomer ? (
                <>
                  <div className="mb-6 rounded-3xl border border-border bg-background p-4">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">Escolha os tamanhos dos 10 pares</p>
                        <p className="text-xs text-muted-foreground font-body">Você pode repetir tamanhos quantas vezes quiser.</p>
                      </div>
                      <button onClick={() => setBundleSizes(Array.from({ length: BUNDLE_SLOTS }, () => ''))} className="rounded-full border border-border px-3 py-1.5 text-xs font-medium">Limpar</button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {bundleSizes.map((size, index) => (
                        <label key={index} className="space-y-1">
                          <span className="text-xs font-body text-muted-foreground">Par {index + 1}</span>
                          <select
                            value={size}
                            onChange={(e) => setBundleSizes((prev) => prev.map((item, i) => i === index ? e.target.value : item))}
                            className="admin-input"
                          >
                            <option value="">Selecione o tamanho</option>
                            {product.sizes.map((productSize) => (
                              <option key={productSize} value={productSize}>{productSize}</option>
                            ))}
                          </select>
                        </label>
                      ))}
                    </div>
                    <div className="mt-4 rounded-2xl bg-muted/40 p-3">
                      <p className="text-xs font-semibold uppercase tracking-luxury text-muted-foreground">Resumo dos 10 pares</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {Object.keys(bundleSummary).length > 0 ? Object.entries(bundleSummary).map(([size, qty]) => (
                          <span key={size} className="rounded-full border border-border px-3 py-1 text-xs font-body">Tam {size}: {qty}</span>
                        )) : <span className="text-xs text-muted-foreground font-body">Nenhum tamanho escolhido ainda.</span>}
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 flex gap-3">
                    <Button variant="premium" size="xl" className="flex-1" onClick={handleAddBundleToCart} disabled={bundleSizes.some((size) => !size)}>
                      <ShoppingBag className="h-4 w-4" />Adicionar 10 pares ao carrinho
                    </Button>
                    <button onClick={() => toggleFavorite(product.id)} className={`flex h-14 w-14 items-center justify-center border transition-colors hover:bg-accent ${fav ? 'border-rose' : 'border-border'}`}><Heart className={`h-5 w-5 ${fav ? 'fill-rose text-rose' : ''}`} /></button>
                  </div>
                </>
              ) : (
                <div className="mb-6 flex gap-3">
                  <Button variant="premium" size="xl" className="flex-1" asChild>
                    <Link to="/login">Entrar para montar 10 pares</Link>
                  </Button>
                  <button onClick={() => toggleFavorite(product.id)} className={`flex h-14 w-14 items-center justify-center border transition-colors hover:bg-accent ${fav ? 'border-rose' : 'border-border'}`}><Heart className={`h-5 w-5 ${fav ? 'fill-rose text-rose' : ''}`} /></button>
                </div>
              )}

              <Button variant="gold" size="lg" className="w-full mb-8" asChild>
                <a href={`https://wa.me/${SITE_PHONE_RAW}`} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-4 w-4" />Comprar pelo WhatsApp</a>
              </Button>

              <div className="space-y-3 border-t border-border py-6">
                {[
                  { icon: Truck, text: 'Frete automático por cidade e estado' },
                  { icon: RotateCcw, text: 'Trocas em até 30 dias' },
                  { icon: ShieldCheck, text: 'Pagamento 100% seguro' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm font-body text-muted-foreground"><item.icon className="h-4 w-4 text-gold" />{item.text}</div>
                ))}
              </div>

              <div className="border-t border-border py-6">
                <h3 className="mb-4 text-xs font-body font-semibold uppercase tracking-luxury">Descrição</h3>
                <p className="text-sm font-body leading-relaxed text-foreground/70">{product.description}</p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {related.length > 0 && (
          <section className="mt-16 md:mt-24">
            <ScrollReveal><div className="mb-12 text-center"><h2 className="font-display text-2xl font-light md:text-3xl">Você Também Vai Amar</h2></div></ScrollReveal>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {related.map((p, i) => <ScrollReveal key={p.id} delay={i * 0.08}><ProductCard product={p} /></ScrollReveal>)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
