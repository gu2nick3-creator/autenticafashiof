import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Novidades', to: '/loja?filter=new' },
  { label: 'Loja', to: '/loja' },
  { label: 'Promoções', to: '/loja?filter=sale' },
  { label: 'Sobre', to: '/sobre' },
  { label: 'Contato', to: '/contato' },
];

export function Header() {
  const { cartCount } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  return (
    <><div className="bg-primary text-primary-foreground text-xs tracking-luxury text-center py-2 font-body">FRETE AUTOMÁTICO POR CIDADE E ESTADO | PARCELE EM ATÉ 6X SEM JUROS</div><header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border"><div className="container flex items-center justify-between gap-2 h-16 md:h-20"><button onClick={() => setMobileOpen(true)} className="md:hidden p-2 hover:bg-accent rounded transition-colors shrink-0" aria-label="Menu"><Menu className="w-5 h-5" /></button><Link to="/" className="flex-1 md:flex-none text-center md:text-left min-w-0"><h1 className="font-display text-[1.15rem] md:text-2xl font-semibold tracking-[0.25em] uppercase"><span className="md:hidden whitespace-nowrap text-[1.05rem] tracking-[0.32em]">— AUTÊNTICA —</span><span className="hidden md:inline">AUTÊNTICA <span className="font-light">FASHION</span><span className="text-gold">F</span></span></h1></Link><nav className="hidden md:flex items-center gap-8">{navLinks.map(link => <Link key={link.to} to={link.to} className="text-xs tracking-luxury uppercase font-body text-foreground/70 hover:text-foreground transition-colors relative group">{link.label}<span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground group-hover:w-full transition-all duration-300" /></Link>)}</nav><div className="flex items-center gap-0.5 md:gap-3"><button onClick={() => setSearchOpen(!searchOpen)} className="p-2 hover:bg-accent rounded transition-colors" aria-label="Buscar"><Search className="w-4 h-4 md:w-5 md:h-5" /></button><Link to="/login" className="p-2 hover:bg-accent rounded transition-colors hidden md:flex"><User className="w-5 h-5" /></Link><Link to="/favoritos" className="p-2 hover:bg-accent rounded transition-colors"><Heart className="w-4 h-4 md:w-5 md:h-5" /></Link><Link to="/carrinho" className="p-2 hover:bg-accent rounded transition-colors relative"><ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />{cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 bg-gold text-white text-[10px] font-body font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>}</Link></div></div><AnimatePresence>{searchOpen && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-border overflow-hidden"><div className="container py-4"><input type="text" placeholder="Busque produtos, categorias e novidades" className="w-full bg-transparent text-sm font-body outline-none placeholder:text-muted-foreground" autoFocus /></div></motion.div>}</AnimatePresence></header><AnimatePresence>{mobileOpen && <><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-foreground/30 z-50" onClick={() => setMobileOpen(false)} /><motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'tween', duration: 0.3 }} className="fixed left-0 top-0 bottom-0 w-72 bg-background z-50 p-6 flex flex-col"><div className="flex justify-between items-center mb-8"><span className="font-display text-lg font-semibold">Menu</span><button onClick={() => setMobileOpen(false)} aria-label="Fechar"><X className="w-5 h-5" /></button></div><nav className="flex flex-col gap-4">{navLinks.map(link => <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className="text-sm tracking-luxury uppercase font-body py-2 border-b border-border">{link.label}</Link>)}<Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm tracking-luxury uppercase font-body py-2 border-b border-border">Entrar / Conta</Link></nav></motion.div></>}</AnimatePresence></>
  );
}
