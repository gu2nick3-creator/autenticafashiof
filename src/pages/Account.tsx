import { useMemo, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { User, MapPin, ShoppingBag, Heart, LogOut, Phone, Mail, CreditCard, Plus } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

type AccountSection = 'dados' | 'enderecos';

const menuItems: { icon: typeof User; label: string; section: AccountSection; to: string }[] = [
  { icon: User, label: 'Dados Pessoais', section: 'dados', to: '/conta?aba=dados' },
  { icon: MapPin, label: 'Endereços', section: 'enderecos', to: '/conta?aba=enderecos' },
  { icon: ShoppingBag, label: 'Meus Pedidos', section: 'dados', to: '/pedidos' },
  { icon: Heart, label: 'Favoritos', section: 'dados', to: '/favoritos' },
];

const emptyAddress = {
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  zipCode: '',
};

export default function Account() {
  const { currentCustomer, logoutCustomer, getCustomerOrders, addCustomerAddress } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [savingAddress, setSavingAddress] = useState(false);

  if (!currentCustomer) {
    return <Navigate to="/login" replace />;
  }

  const orders = getCustomerOrders();
  const activeSection = useMemo<AccountSection>(() => {
    const params = new URLSearchParams(location.search);
    return params.get('aba') === 'enderecos' ? 'enderecos' : 'dados';
  }, [location.search]);

  const openAddresses = () => navigate('/conta?aba=enderecos');

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddress(true);
    const result = await addCustomerAddress({
      street: addressForm.street.trim(),
      number: addressForm.number.trim(),
      complement: addressForm.complement.trim(),
      neighborhood: addressForm.neighborhood.trim(),
      city: addressForm.city.trim(),
      state: addressForm.state.trim().toUpperCase(),
      zipCode: addressForm.zipCode.trim(),
    });
    setSavingAddress(false);
    toast({ title: result.ok ? 'Endereço salvo' : 'Não foi possível salvar', description: result.message });
    if (result.ok) {
      setAddressForm(emptyAddress);
      setShowAddressForm(false);
      openAddresses();
    }
  };

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
                <Link
                  to={item.to}
                  className={`flex items-center gap-4 p-5 border transition-colors group ${item.section === activeSection ? 'border-gold bg-gold/5' : 'border-border hover:border-gold'}`}
                >
                  <item.icon className="w-5 h-5 text-gold" />
                  <span className="text-sm font-body font-medium group-hover:text-gold transition-colors">{item.label}</span>
                </Link>
              </ScrollReveal>
            ))}
          </div>

          <div className="space-y-6">
            {activeSection === 'dados' && (
              <>
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
              </>
            )}

            {activeSection === 'enderecos' && (
              <ScrollReveal>
                <div className="border border-border p-6 space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h2 className="text-xs tracking-luxury uppercase font-body font-semibold">Endereços Salvos</h2>
                      <p className="text-sm text-muted-foreground font-body mt-2">{currentCustomer.addresses.length} cadastrado(s)</p>
                    </div>
                    <Button variant="premium" onClick={() => setShowAddressForm((prev) => !prev)}>
                      <Plus className="w-4 h-4" /> {showAddressForm ? 'Fechar formulário' : 'Adicionar endereço'}
                    </Button>
                  </div>

                  {showAddressForm && (
                    <form onSubmit={handleAddressSubmit} className="grid gap-4 rounded-3xl border border-border bg-muted/20 p-5 md:grid-cols-2">
                      <input type="text" required placeholder="CEP" value={addressForm.zipCode} onChange={(e) => setAddressForm((prev) => ({ ...prev, zipCode: e.target.value }))} className="w-full h-11 px-4 border border-border text-sm font-body outline-none focus:border-gold transition-colors bg-background" />
                      <input type="text" required placeholder="Estado (UF)" value={addressForm.state} onChange={(e) => setAddressForm((prev) => ({ ...prev, state: e.target.value }))} className="w-full h-11 px-4 border border-border text-sm font-body outline-none focus:border-gold transition-colors bg-background" />
                      <input type="text" required placeholder="Cidade" value={addressForm.city} onChange={(e) => setAddressForm((prev) => ({ ...prev, city: e.target.value }))} className="w-full h-11 px-4 border border-border text-sm font-body outline-none focus:border-gold transition-colors bg-background" />
                      <input type="text" required placeholder="Bairro" value={addressForm.neighborhood} onChange={(e) => setAddressForm((prev) => ({ ...prev, neighborhood: e.target.value }))} className="w-full h-11 px-4 border border-border text-sm font-body outline-none focus:border-gold transition-colors bg-background" />
                      <input type="text" required placeholder="Rua" value={addressForm.street} onChange={(e) => setAddressForm((prev) => ({ ...prev, street: e.target.value }))} className="w-full h-11 px-4 border border-border text-sm font-body outline-none focus:border-gold transition-colors bg-background md:col-span-2" />
                      <input type="text" required placeholder="Número" value={addressForm.number} onChange={(e) => setAddressForm((prev) => ({ ...prev, number: e.target.value }))} className="w-full h-11 px-4 border border-border text-sm font-body outline-none focus:border-gold transition-colors bg-background" />
                      <input type="text" placeholder="Complemento" value={addressForm.complement} onChange={(e) => setAddressForm((prev) => ({ ...prev, complement: e.target.value }))} className="w-full h-11 px-4 border border-border text-sm font-body outline-none focus:border-gold transition-colors bg-background" />
                      <div className="md:col-span-2 flex flex-wrap gap-3">
                        <Button type="submit" variant="premium" disabled={savingAddress}>{savingAddress ? 'Salvando...' : 'Salvar endereço'}</Button>
                        <Button type="button" variant="outline" onClick={() => setShowAddressForm(false)}>Cancelar</Button>
                      </div>
                    </form>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    {currentCustomer.addresses.length > 0 ? currentCustomer.addresses.map((address, index) => (
                      <div key={`${address.zipCode}-${index}`} className="border border-border p-4 text-sm font-body rounded-2xl">
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
