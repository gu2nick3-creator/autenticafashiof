import { ScrollReveal } from '@/components/ScrollReveal';
import { Link, Navigate } from 'react-router-dom';
import { Package, Truck, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const statusLabels: Record<string, string> = { pending: 'Pendente', paid: 'Pago', processing: 'Em separação', shipped: 'Enviado', delivered: 'Entregue', cancelled: 'Cancelado' };
const statusColors: Record<string, string> = { pending: 'text-muted-foreground', paid: 'text-gold', processing: 'text-gold', shipped: 'text-foreground', delivered: 'text-green-600', cancelled: 'text-destructive' };

export default function Orders() {
  const { currentCustomer, getCustomerOrders } = useAuth();
  if (!currentCustomer) return <Navigate to="/login" replace />;
  const orders = getCustomerOrders();

  return (
    <div className="py-8 md:py-12"><div className="container max-w-4xl"><ScrollReveal><h1 className="font-display text-3xl md:text-4xl font-light mb-8">Meus Pedidos</h1></ScrollReveal>{orders.length === 0 ? <div className="text-center py-16"><Package className="w-10 h-10 mx-auto text-muted-foreground mb-4" /><p className="font-display text-xl font-light">Nenhum pedido ainda</p></div> : <div className="space-y-4">{orders.map((order, i) => <ScrollReveal key={order.id} delay={i * 0.05}><div className="border border-border p-5 flex flex-col gap-4"><div className="flex flex-col md:flex-row md:items-center justify-between gap-4"><div><p className="text-sm font-body font-semibold">{order.id}</p><p className="text-xs text-muted-foreground font-body mt-1">{new Date(order.createdAt).toLocaleDateString('pt-BR')} · {order.items.length || 1} item(ns)</p></div><div className="flex items-center gap-6 flex-wrap"><span className={`text-xs font-body font-semibold tracking-luxury uppercase ${statusColors[order.status] || ''}`}>{statusLabels[order.status] || order.status}</span><span className="text-sm font-body font-semibold">R$ {order.total.toFixed(2).replace('.', ',')}</span></div></div><div className="grid md:grid-cols-[1fr_auto] gap-4 items-center border-t border-border pt-4"><div className="text-sm font-body text-muted-foreground space-y-2"><div className="flex items-center gap-2"><Truck className="w-4 h-4 text-gold" /> Código de rastreio: <span className="text-foreground">{order.trackingCode || 'Aguardando envio'}</span></div><div className="flex items-start gap-2"><MapPin className="w-4 h-4 text-gold mt-0.5" /><span className="text-foreground">{order.address.street}, {order.address.number} - {order.address.neighborhood}, {order.address.city}/{order.address.state}</span></div></div><Link to="/conta" className="text-sm font-body text-muted-foreground hover:text-foreground">Voltar à conta</Link></div></div></ScrollReveal>)}</div>}</div></div>
  );
}
