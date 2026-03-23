import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Product } from '@/types';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toggleFavorite, isFavorite, addToCart } = useStore();
  const { currentCustomer } = useAuth();
  const fav = isFavorite(product.id);
  const displayPrice = product.salePrice || product.price;
  const resaleBundlePrice = displayPrice * 10;

  return (
    <motion.div
      className="group relative"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] bg-cream overflow-hidden mb-4">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="bg-primary text-primary-foreground text-[10px] tracking-luxury uppercase font-body px-2.5 py-1">
              Novo
            </span>
          )}
          {product.onSale && (
            <span className="bg-gold text-white text-[10px] tracking-luxury uppercase font-body px-2.5 py-1">
              Promoção
            </span>
          )}
          {product.bestSeller && !product.isNew && (
            <span className="bg-rose text-white text-[10px] tracking-luxury uppercase font-body px-2.5 py-1">
              + Vendido
            </span>
          )}
        </div>

        {/* Favorite */}
        <button
          onClick={() => toggleFavorite(product.id)}
          className="absolute top-3 right-3 w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors"
          aria-label="Favoritar"
        >
          <Heart className={`w-4 h-4 ${fav ? 'fill-rose text-rose' : ''}`} />
        </button>

        {/* Hover overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 p-3 flex gap-2">
          <Link
            to={`/produto/${product.slug}`}
            className="flex-1 bg-background/90 backdrop-blur-sm text-foreground text-xs tracking-luxury uppercase font-body font-medium py-3 flex items-center justify-center gap-2 hover:bg-background transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Ver
          </Link>
          <button
            onClick={() => addToCart(product, product.sizes[0], product.colors[0]?.name || '', 1)}
            className="flex-1 bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs tracking-luxury uppercase font-body font-medium py-3 flex items-center justify-center gap-2 hover:bg-primary transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Comprar
          </button>
        </div>
      </div>

      {/* Info */}
      <div>
        <p className="text-xs text-muted-foreground font-body tracking-wider uppercase mb-1">
          {product.category}
        </p>
        <Link to={`/produto/${product.slug}`}>
          <h3 className="font-display text-base md:text-lg font-medium leading-tight hover:text-gold transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mt-2 font-body">
          {product.salePrice ? (
            <>
              <span className="text-sm text-muted-foreground line-through">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-sm font-semibold text-gold">
                R$ {product.salePrice.toFixed(2).replace('.', ',')}
              </span>
            </>
          ) : (
            <span className="text-sm font-semibold">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground font-body mt-1">
          ou 6x de R$ {(displayPrice / 6).toFixed(2).replace('.', ',')} sem juros
        </p>

        <div className="mt-3 rounded-2xl border border-border bg-muted/30 p-3">
          <p className="text-[11px] uppercase tracking-luxury text-muted-foreground font-body">Preço para revender</p>
          {currentCustomer ? (
            <>
              <p className="mt-1 text-sm font-semibold font-body">
                10 pares: R$ {resaleBundlePrice.toFixed(2).replace('.', ',')}
              </p>
              <p className="text-[11px] text-muted-foreground font-body mt-1">Valor liberado após login.</p>
            </>
          ) : (
            <Link
              to="/login"
              className="mt-2 inline-flex min-h-10 items-center justify-center rounded-full border border-foreground px-4 text-[11px] font-medium uppercase tracking-luxury transition-colors hover:bg-foreground hover:text-background"
            >
              Faça login
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
