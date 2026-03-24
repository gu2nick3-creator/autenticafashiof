import { useStore } from '@/contexts/StoreContext';
import { ProductCard } from '@/components/ProductCard';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Favorites() {
  const { favorites, products } = useStore();
  const favProducts = products.filter(p => favorites.includes(p.id));

  return (
    <div className="py-8 md:py-12"><div className="container"><ScrollReveal><h1 className="font-display text-3xl md:text-4xl font-light mb-8">Favoritos</h1></ScrollReveal>{favProducts.length === 0 ? <div className="text-center py-24"><Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" /><p className="font-display text-2xl font-light mb-2">Nenhum favorito ainda</p><p className="text-sm text-muted-foreground font-body mb-8">Explore nossa coleção e salve suas peças favoritas.</p><Button variant="premium" size="lg" asChild><Link to="/loja">Explorar Coleção</Link></Button></div> : <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">{favProducts.map((product, i) => <ScrollReveal key={product.id} delay={i * 0.05}><ProductCard product={product} /></ScrollReveal>)}</div>}</div></div>
  );
}
