import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '@/components/ProductCard';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SlidersHorizontal, X } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';

type SortOption = 'newest' | 'best' | 'price-low' | 'price-high';

export default function Shop() {
  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get('filter');
  const categoryParam = searchParams.get('category');
  const { products } = useStore();
  const categories = [...new Set(products.map(product => product.category))];

  const [selectedCategory, setSelectedCategory] = useState(categoryParam || '');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [onlyOnSale, setOnlyOnSale] = useState(filterParam === 'sale');
  const [onlyNew, setOnlyNew] = useState(filterParam === 'new');

  const filtered = useMemo(() => {
    let items = [...products].filter(p => p.active);
    if (selectedCategory) items = items.filter(p => p.category === selectedCategory);
    if (onlyOnSale) items = items.filter(p => p.onSale);
    if (onlyNew) items = items.filter(p => p.isNew);
    switch (sortBy) {
      case 'newest': return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      case 'best': return items.sort((a, b) => b.reviewCount - a.reviewCount);
      case 'price-low': return items.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
      case 'price-high': return items.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
      default: return items;
    }
  }, [products, selectedCategory, sortBy, onlyOnSale, onlyNew]);

  const clearFilters = () => { setSelectedCategory(''); setOnlyOnSale(false); setOnlyNew(false); };
  const hasActiveFilters = selectedCategory || onlyOnSale || onlyNew;

  return (
    <div className="py-8 md:py-12"><div className="container"><ScrollReveal><div className="flex items-start justify-between gap-4 mb-8"><div><h1 className="font-display text-3xl md:text-4xl font-light mb-2">Loja</h1><p className="text-sm text-muted-foreground font-body">Peças selecionadas para você.</p></div><button onClick={() => setShowFilters(!showFilters)} className="md:hidden flex items-center gap-2 text-sm font-body border border-border px-4 py-2"><SlidersHorizontal className="w-4 h-4" /> Filtros</button></div></ScrollReveal><div className="grid md:grid-cols-[260px_1fr] gap-8"><aside className={`${showFilters ? 'block' : 'hidden'} md:block border border-border p-5 h-fit space-y-6`}><div><h3 className="text-xs tracking-luxury uppercase font-body font-semibold mb-4">Categorias</h3><div className="space-y-2">{categories.map(cat => <button key={cat} onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)} className={`block w-full text-left text-sm font-body transition-colors ${selectedCategory === cat ? 'text-gold font-semibold' : 'text-foreground/70 hover:text-foreground'}`}>{cat}</button>)}</div></div><div><h3 className="text-xs tracking-luxury uppercase font-body font-semibold mb-4">Filtros</h3><div className="space-y-3 text-sm font-body"><label className="flex items-center gap-2"><input type="checkbox" checked={onlyNew} onChange={e => setOnlyNew(e.target.checked)} /> Novidades</label><label className="flex items-center gap-2"><input type="checkbox" checked={onlyOnSale} onChange={e => setOnlyOnSale(e.target.checked)} /> Promoções</label></div></div><div><h3 className="text-xs tracking-luxury uppercase font-body font-semibold mb-4">Ordenar</h3><select value={sortBy} onChange={e => setSortBy(e.target.value as SortOption)} className="w-full h-11 px-4 border border-border bg-background text-sm font-body"><option value="newest">Mais novos</option><option value="best">Mais vendidos</option><option value="price-low">Menor preço</option><option value="price-high">Maior preço</option></select></div>{hasActiveFilters && <button onClick={clearFilters} className="text-sm font-body text-muted-foreground hover:text-foreground inline-flex items-center gap-2"><X className="w-4 h-4" /> Limpar filtros</button>}</aside><div><div className="flex items-center justify-between mb-6"><p className="text-sm text-muted-foreground font-body">{filtered.length} produto(s)</p></div>{filtered.length === 0 ? <div className="border border-border p-10 text-center"><p className="font-display text-2xl font-light">Nenhum produto encontrado</p></div> : <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">{filtered.map((product, i) => <ScrollReveal key={product.id} delay={i * 0.04}><ProductCard product={product} /></ScrollReveal>)}</div>}</div></div></div></div>
  );
}
