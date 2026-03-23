import { Link, Navigate } from 'react-router-dom';
import { User, MapPin, ShoppingBag, Heart, LogOut, Phone, Mail, CreditCard } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const menuItems = [
  { icon: User, label: 'Dados Pessoais', to: '/conta' },
  { icon: MapPin, label: 'Endereços', to: '/conta' },
  { icon: ShoppingBag, label: 'Meus Pedidos', to: '/pedidos' },
  { icon: Heart, label: 'Favoritos', to: '/favoritos' },
];

export default function Account() {
  const { currentCustomer, logoutCustomer, getCustomerOrders } = useAuth();

  if (!currentCustomer) {
    return <Navigate to="/login" replace />;
  }

  const orders = getCustomerOrders();

  return (
    <div className="py-8 md:py-12">
      <div className="container max-w-5xl">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-light mb-2">Minha Conta</h1>
              <p className="text-sm text-muted-foreground font-body">Gerencie seus dados, pedidos e endereços salvos.</p>
            </div>
            <Button variant="premium-outline" onClick={logoutCustomer}><LogOut className="w-4 h-4" /> Sair</Button>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-[280px,1fr] gap-6">
          <div className="space-y-3">
            {menuItems.map((item, i) => (
              <ScrollReveal key={item.label} delay={i * 0.05}>
                <Link to={item.to} className="flex items-center gap-4 p-5 border border-border hover:border-gold transition-colors group">
                  <item.icon className="w-5 h-5 text-gold" />
                  <span className="text-sm font-body font-medium group-hover:text-gold transition-colors">{item.label}</span>
                </Link>
              </ScrollReveal>
            ))}
          </div>

          <div className="space-y-6">
            <ScrollReveal>
              <div className="border border-border p-6">
                <h2 className="text-xs tracking-luxury uppercase font-body font-semibold mb-5">Dados Pessoais</h2>
                <div className="grid md:grid-cols-2 gap-4 text-sm font-body">
                  <div className="border border-border p-4 flex gap-3"><User className="w-4 h-4 text-gold mt-0.5" /><div><p className="text-muted-foreground">Nome</p><p>{currentCustomer.name}</p></div></div>
                  <div className="border border-border p-4 flex gap-3"><Mail className="w-4 h-4 text-gold mt-0.5" /><div><p className="text-muted-foreground">E-mail</p><p>{currentCustomer.email}</p></div></div>
                  <div className="border border-border p-4 flex gap-3"><Phone className="w-4 h-4 text-gold mt-0.5" /><div><p className="text-muted-foreground">Telefone</p><p>{currentCustomer.phone}</p></div></div>
                  <div className="border border-border p-4 flex gap-3"><CreditCard className="w-4 h-4 text-gold mt-0.5" /><div><p className="text-muted-foreground">CPF</p><p>{currentCustomer.cpf || 'Não informado'}</p></div></div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.05}>
              <div className="border border-border p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xs tracking-luxury uppercase font-body font-semibold">Endereços Salvos</h2>
                  <span className="text-xs text-muted-foreground font-body">{currentCustomer.addresses.length} cadastrado(s)</span>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {currentCustomer.addresses.length > 0 ? currentCustomer.addresses.map((address, index) => (
                    <div key={`${address.zipCode}-${index}`} className="border border-border p-4 text-sm font-body">
                      <p>{address.street}, {address.number}</p>
                      {address.complement && <p>{address.complement}</p>}
                      <p>{address.neighborhood}</p>
                      <p>{address.city} - {address.state}</p>
                      <p>CEP: {address.zipCode}</p>
                    </div>
                  )) : <p className="text-sm text-muted-foreground font-body">Nenhum endereço salvo ainda.</p>}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="border border-border p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xs tracking-luxury uppercase font-body font-semibold">Resumo dos Pedidos</h2>
                  <Link to="/pedidos" className="text-xs text-gold font-body">Ver todos</Link>
                </div>
                <div className="grid md:grid-cols-3 gap-4 text-sm font-body">
                  <div className="border border-border p-4"><p className="text-muted-foreground">Total de pedidos</p><p className="text-2xl font-display mt-2">{orders.length}</p></div>
                  <div className="border border-border p-4"><p className="text-muted-foreground">Total gasto</p><p className="text-2xl font-display mt-2">R$ {currentCustomer.totalSpent.toFixed(2).replace('.', ',')}</p></div>
                  <div className="border border-border p-4"><p className="text-muted-foreground">Último pedido</p><p className="text-2xl font-display mt-2">{orders[0]?.id || '--'}</p></div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}
