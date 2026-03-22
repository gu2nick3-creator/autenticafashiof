import { useEffect, useState, type ReactNode } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Package, ShoppingBag, Users, DollarSign, Tag, Settings, Plus, ArrowUpRight, LogOut, Trash2, Pencil, Eye, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useStore } from '@/contexts/StoreContext';
import type { Coupon, OrderStatus, Product } from '@/types';

const adminNav = [
  { icon: LayoutDashboard, label: 'Dashboard', section: 'dashboard' },
  { icon: Package, label: 'Produtos', section: 'products' },
  { icon: ShoppingBag, label: 'Pedidos', section: 'orders' },
  { icon: Users, label: 'Clientes', section: 'customers' },
  { icon: DollarSign, label: 'Financeiro', section: 'finance' },
  { icon: Tag, label: 'Cupons', section: 'coupons' },
  { icon: Settings, label: 'Configurações', section: 'settings' },
];

const statusColors: Record<string, string> = { pending: 'bg-muted text-muted-foreground', paid: 'bg-gold/10 text-gold', processing: 'bg-gold/10 text-gold', shipped: 'bg-blue-50 text-blue-700', delivered: 'bg-green-50 text-green-700', cancelled: 'bg-red-50 text-destructive' };
const statusLabels: Record<OrderStatus, string> = { pending: 'Pendente', paid: 'Pago', processing: 'Em separação', shipped: 'Enviado', delivered: 'Entregue', cancelled: 'Cancelado' };

const emptyProduct = {
  name: '', sku: '', shortDescription: '', description: '', price: 0, salePrice: 0, category: '', productType: 'sapato' as const,
  sizes: [''], colors: [{ name: 'Preto', hex: '#111111' }], images: [] as string[], stock: 0, featured: false, isNew: true, onSale: false, bestSeller: false, active: true,
};

export default function AdminPanel() {
  const [section, setSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isAdminAuthenticated, logoutAdmin, orders, customers, updateOrderStatus, updateOrderTracking } = useAuth();
  const { products, coupons, addProduct, updateProduct, deleteProduct, createCoupon, deleteCoupon, refreshProducts, refreshCoupons } = useStore();

  useEffect(() => {
    refreshProducts();
    refreshCoupons();
  }, [refreshProducts, refreshCoupons]);

  if (!isAdminAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      <div className="md:hidden sticky top-0 z-30 border-b bg-white">
        <div className="flex items-center justify-between gap-3 px-4 py-3"><div><p className="text-lg font-semibold">Painel ADM</p><p className="text-xs text-slate-500">Deslize para ver todas as abas.</p></div><Button variant="outline" size="sm" onClick={logoutAdmin}>Sair</Button></div>
        <div className="overflow-x-auto pb-3"><div className="flex min-w-max gap-2 px-4">{adminNav.map(item => <button key={item.section} onClick={() => setSection(item.section)} className={`flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-2 text-xs transition-colors ${section === item.section ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-600'}`}><item.icon className="w-4 h-4" /><span>{item.label}</span></button>)}</div></div>
      </div>

      <aside className={`${sidebarOpen ? 'w-60' : 'w-16'} bg-white border-r border-slate-200 flex-shrink-0 transition-all duration-300 hidden md:flex flex-col`}>
        <div className="p-4 border-b border-slate-200"><Link to="/" className="text-sm font-semibold tracking-wide">{sidebarOpen ? 'Autêntica Admin' : 'AF'}</Link></div>
        <nav className="flex-1 py-4">{adminNav.map(item => <button key={item.section} onClick={() => setSection(item.section)} className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${section === item.section ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}><item.icon className="w-4 h-4 flex-shrink-0" />{sidebarOpen && <span>{item.label}</span>}</button>)}</nav>
        <div className="p-4 border-t border-slate-200 space-y-3"><button onClick={() => setSidebarOpen(prev => !prev)} className="text-sm text-slate-500">{sidebarOpen ? 'Recolher menu' : 'Abrir menu'}</button><button onClick={logoutAdmin} className="flex items-center gap-2 text-sm text-slate-700 hover:text-slate-950"><LogOut className="w-4 h-4" />{sidebarOpen && <span>Sair do painel</span>}</button></div>
      </aside>

      <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8 overflow-auto w-full">
        {section === 'dashboard' && <DashboardSection ordersCount={orders.length} customersCount={customers.length} revenue={orders.reduce((acc, item) => acc + item.total, 0)} productsCount={products.length} />}
        {section === 'products' && <ProductsSection products={products} addProduct={addProduct} updateProduct={updateProduct} deleteProduct={deleteProduct} />}
        {section === 'orders' && <OrdersSection orders={orders} updateOrderStatus={updateOrderStatus} updateOrderTracking={updateOrderTracking} />}
        {section === 'customers' && <CustomersSection customers={customers} />}
        {section === 'finance' && <FinanceSection revenue={orders.reduce((acc, item) => acc + item.total, 0)} orders={orders.length} />}
        {section === 'coupons' && <CouponsSection coupons={coupons} createCoupon={createCoupon} deleteCoupon={deleteCoupon} />}
        {section === 'settings' && <SettingsSection />}
      </main>
    </div>
  );
}

function DashboardSection({ ordersCount, customersCount, revenue, productsCount }: { ordersCount: number; customersCount: number; revenue: number; productsCount: number }) {
  const stats = [
    { label: 'Vendas Totais', value: `R$ ${revenue.toFixed(2).replace('.', ',')}`, change: '+12%', icon: DollarSign },
    { label: 'Pedidos', value: String(ordersCount), change: '+8%', icon: ShoppingBag },
    { label: 'Produtos', value: String(productsCount), change: 'catálogo', icon: Package },
    { label: 'Clientes', value: String(customersCount), change: '+15%', icon: Users },
  ];
  return <div><h2 className="text-2xl md:text-3xl font-semibold mb-6">Dashboard</h2><div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">{stats.map(stat => <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5 shadow-sm"><div className="flex items-center justify-between mb-3"><stat.icon className="w-4 h-4 text-amber-500" /><span className="flex items-center gap-0.5 text-xs text-emerald-600"><ArrowUpRight className="w-3 h-3" />{stat.change}</span></div><p className="text-xl md:text-2xl font-semibold">{stat.value}</p><p className="text-xs text-slate-500 mt-1">{stat.label}</p></div>)}</div></div>;
}

function ProductsSection({ products, addProduct, updateProduct, deleteProduct }: any) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyProduct);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyProduct);
    setShowForm(true);
  };

  const resetForm = () => {
    setForm(emptyProduct);
    setEditing(null);
    setShowForm(false);
  };

  const startEdit = (product: Product) => {
    setEditing(product);
    setForm({
      ...product,
      salePrice: product.salePrice || 0,
      sizes: product.sizes.length ? product.sizes : [''],
      colors: product.colors.length ? product.colors : [{ name: 'Preto', hex: '#111111' }],
    });
    setShowForm(true);
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const readers = await Promise.all(
      Array.from(files).map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.readAsDataURL(file);
          }),
      ),
    );
    setForm((prev) => ({ ...prev, images: [...prev.images, ...readers] }));
  };

  const submit = () => {
    const payload = { ...form, salePrice: form.salePrice || undefined };
    if (editing) updateProduct(editing.id, payload);
    else addProduct(payload);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Produtos</h2>
          <p className="text-sm text-slate-500">Cadastre, edite e remova produtos do catálogo.</p>
        </div>
        <Button variant="premium" size="sm" onClick={openCreate}>
          <Plus className="w-4 h-4" /> Novo Produto
        </Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/45 backdrop-blur-[1px]" onClick={resetForm}>
          <div
            className="h-full w-full max-w-2xl overflow-y-auto border-l border-slate-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Painel de produtos</p>
                  <h3 className="mt-1 text-xl font-semibold text-slate-900">{editing ? 'Editar produto' : 'Novo produto'}</h3>
                  <p className="mt-1 text-sm text-slate-500">Abra, preencha e salve sem poluir a tela do painel.</p>
                </div>
                <button
                  onClick={resetForm}
                  className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-100"
                >
                  Fechar
                </button>
              </div>
            </div>

            <div className="space-y-6 p-5 md:p-6">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Nome do produto">
                    <input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} className="admin-input" placeholder="Ex.: Tênis casual feminino" />
                  </Field>
                  <Field label="SKU">
                    <input value={form.sku} onChange={(e) => setForm((prev) => ({ ...prev, sku: e.target.value }))} className="admin-input" placeholder="COD-001" />
                  </Field>
                  <Field label="Preço">
                    <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm((prev) => ({ ...prev, price: Number(e.target.value) }))} className="admin-input" />
                  </Field>
                  <Field label="Preço promocional">
                    <input type="number" min="0" step="0.01" value={form.salePrice} onChange={(e) => setForm((prev) => ({ ...prev, salePrice: Number(e.target.value) }))} className="admin-input" />
                  </Field>
                  <Field label="Estoque">
                    <input type="number" min="0" value={form.stock} onChange={(e) => setForm((prev) => ({ ...prev, stock: Number(e.target.value) }))} className="admin-input" />
                  </Field>
                  <Field label="Categoria">
                    <input value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))} className="admin-input" placeholder="Ex.: lançamentos" />
                  </Field>
                  <Field label="Tipo do produto">
                    <select value={form.productType} onChange={(e) => setForm((prev) => ({ ...prev, productType: e.target.value as 'roupa' | 'sapato' }))} className="admin-input">
                      <option value="sapato">Sapato</option>
                      <option value="roupa">Roupa</option>
                    </select>
                  </Field>
                  <Field label="Tamanhos">
                    <input
                      value={form.sizes.join(', ')}
                      onChange={(e) => setForm((prev) => ({ ...prev, sizes: e.target.value.split(',').map((v) => v.trim()) }))}
                      className="admin-input"
                      placeholder="34, 35, 36 ou P, M, G"
                    />
                  </Field>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.25fr_0.95fr]">
                <div className="space-y-6">
                  <div className="rounded-3xl border border-slate-200 bg-white p-4">
                    <Field label="Descrição curta">
                      <input value={form.shortDescription} onChange={(e) => setForm((prev) => ({ ...prev, shortDescription: e.target.value }))} className="admin-input" placeholder="Resumo rápido para cards e vitrines" />
                    </Field>
                    <div className="mt-4">
                      <Field label="Descrição completa">
                        <textarea value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} className="admin-input min-h-32 py-3" placeholder="Detalhes completos do produto" />
                      </Field>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Painel de cores</p>
                        <p className="text-xs text-slate-500">Adicione quantas cores quiser.</p>
                      </div>
                      <button onClick={() => setForm((prev) => ({ ...prev, colors: [...prev.colors, { name: '', hex: '#000000' }] }))} className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100">+ Nova cor</button>
                    </div>
                    <div className="space-y-3">
                      {form.colors.map((color, index) => (
                        <div key={index} className="grid grid-cols-[1fr_110px_auto] gap-3 items-center">
                          <input value={color.name} onChange={(e) => setForm((prev) => ({ ...prev, colors: prev.colors.map((item, i) => i === index ? { ...item, name: e.target.value } : item) }))} className="admin-input" placeholder="Nome da cor" />
                          <input type="color" value={color.hex} onChange={(e) => setForm((prev) => ({ ...prev, colors: prev.colors.map((item, i) => i === index ? { ...item, hex: e.target.value } : item) }))} className="h-11 w-full rounded-xl border border-slate-200 bg-white" />
                          <button onClick={() => setForm((prev) => ({ ...prev, colors: prev.colors.filter((_, i) => i !== index) }))} className="rounded-xl px-3 py-2 text-sm text-rose-600 transition hover:bg-rose-50">Remover</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-3xl border border-slate-200 bg-white p-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Imagens do produto</p>
                      <p className="text-xs text-slate-500 mt-1">Envie arquivos do computador, celular ou tire foto na hora.</p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <label className="inline-flex cursor-pointer items-center justify-center rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                        Selecionar arquivos
                        <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
                      </label>
                      <label className="inline-flex cursor-pointer items-center justify-center rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                        Tirar foto no celular
                        <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
                      </label>
                    </div>

                    {form.images.length > 0 ? (
                      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {form.images.map((image, index) => (
                          <div key={index} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                            <img src={image} alt="Preview" className="aspect-square w-full object-cover" />
                            <button onClick={() => setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))} className="absolute right-2 top-2 rounded-full bg-white/95 p-1.5 shadow-sm">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                        Nenhuma imagem adicionada ainda.
                      </div>
                    )}
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-4">
                    <p className="text-sm font-semibold text-slate-900">Destaques do produto</p>
                    <div className="mt-4 grid gap-3 text-sm text-slate-700">
                      <label className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-3"><input type="checkbox" checked={form.featured} onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))} /> Produto em destaque</label>
                      <label className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-3"><input type="checkbox" checked={form.isNew} onChange={(e) => setForm((prev) => ({ ...prev, isNew: e.target.checked }))} /> Marcar como novo</label>
                      <label className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-3"><input type="checkbox" checked={form.onSale} onChange={(e) => setForm((prev) => ({ ...prev, onSale: e.target.checked }))} /> Produto em promoção</label>
                      <label className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-3"><input type="checkbox" checked={form.bestSeller} onChange={(e) => setForm((prev) => ({ ...prev, bestSeller: e.target.checked }))} /> Mais vendido</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 border-t border-slate-200 bg-white px-5 py-4">
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button variant="outline" onClick={resetForm}>Cancelar</Button>
                <Button variant="premium" onClick={submit}>{editing ? 'Salvar alterações' : 'Cadastrar produto'}</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-3">Produto</th>
              <th className="text-left p-3">Tipo</th>
              <th className="text-left p-3">Preço</th>
              <th className="text-left p-3">Estoque</th>
              <th className="text-left p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: Product) => (
              <tr key={product.id} className="border-t border-slate-100 align-top">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <img src={product.images[0]} alt={product.name} className="w-12 h-14 rounded-lg object-cover bg-slate-100" />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-slate-500">{product.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3 capitalize">{product.productType}</td>
                <td className="p-3">R$ {(product.salePrice || product.price).toFixed(2).replace('.', ',')}</td>
                <td className="p-3">{product.stock}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(product)} className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs"><Pencil className="w-3.5 h-3.5" /> Editar</button>
                    <button onClick={() => deleteProduct(product.id)} className="inline-flex items-center gap-1 rounded-xl border border-rose-200 text-rose-600 px-3 py-2 text-xs"><Trash2 className="w-3.5 h-3.5" /> Excluir</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrdersSection({ orders, updateOrderStatus, updateOrderTracking }: any) {
  const [trackingValues, setTrackingValues] = useState<Record<string, string>>(() => Object.fromEntries(orders.map((order: any) => [order.id, order.trackingCode || ''])));
  const [expanded, setExpanded] = useState<string | null>(null);
  return <div><div className="mb-6"><h2 className="text-2xl font-semibold">Pedidos</h2><p className="text-sm text-slate-500">Atualize status, rastreio e visualize o endereço do cliente.</p></div><div className="space-y-4">{orders.map((order: any) => <div key={order.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div className="grid lg:grid-cols-[1fr_auto_auto] gap-4 items-start mb-4"><div><p className="text-sm font-semibold">{order.id} · {order.customer.name}</p><p className="text-xs text-slate-500 mt-1">{order.customer.email} · {new Date(order.createdAt).toLocaleDateString('pt-BR')}</p><p className="text-sm mt-2">Total: R$ {order.total.toFixed(2).replace('.', ',')}</p></div><div><span className={`text-[10px] uppercase px-2 py-1 rounded-full ${statusColors[order.status] || ''}`}>{statusLabels[order.status]}</span></div><button onClick={() => setExpanded(prev => prev === order.id ? null : order.id)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs"><Eye className="w-4 h-4" /> Ver endereço</button></div><div className="grid lg:grid-cols-[220px_1fr_auto] gap-3 items-center"><select value={order.status} onChange={e => updateOrderStatus(order.id, e.target.value)} className="admin-input"><option value="pending">Pendente</option><option value="paid">Pago</option><option value="processing">Em separação</option><option value="shipped">Enviado</option><option value="delivered">Entregue</option><option value="cancelled">Cancelado</option></select><input value={trackingValues[order.id] || ''} onChange={e => setTrackingValues((prev) => ({ ...prev, [order.id]: e.target.value }))} placeholder="Código de rastreio" className="admin-input" /><Button variant="outline" onClick={() => updateOrderTracking(order.id, trackingValues[order.id] || '')}>Salvar rastreio</Button></div>{expanded === order.id && <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700"><div className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5" /><div><p>{order.address.street}, {order.address.number}</p><p>{order.address.neighborhood} {order.address.complement ? `- ${order.address.complement}` : ''}</p><p>{order.address.city}/{order.address.state} - CEP {order.address.zipCode}</p></div></div></div>}</div>)}</div></div>;
}

function CustomersSection({ customers }: any) {
  return <div><h2 className="text-2xl font-semibold mb-6">Clientes</h2><div className="grid md:grid-cols-2 gap-4">{customers.map((customer: any) => <div key={customer.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><p className="font-semibold">{customer.name}</p><p className="text-sm text-slate-500 mt-1">{customer.email}</p><p className="text-sm text-slate-500">{customer.phone}</p><p className="text-sm mt-3">Pedidos: {customer.orders.length}</p></div>)}</div></div>;
}

function FinanceSection({ revenue, orders }: { revenue: number; orders: number }) {
  const avg = orders ? revenue / orders : 0;
  return <div><h2 className="text-2xl font-semibold mb-6">Financeiro</h2><div className="grid md:grid-cols-3 gap-4 mb-6"><div className="rounded-3xl bg-slate-900 text-white p-6"><p className="text-sm text-white/70">Faturamento total</p><p className="text-3xl font-semibold mt-3">R$ {revenue.toFixed(2).replace('.', ',')}</p></div><div className="rounded-3xl bg-emerald-50 border border-emerald-100 p-6"><p className="text-sm text-emerald-700">Ticket médio</p><p className="text-3xl font-semibold mt-3">R$ {avg.toFixed(2).replace('.', ',')}</p></div><div className="rounded-3xl bg-amber-50 border border-amber-100 p-6"><p className="text-sm text-amber-700">Pedidos fechados</p><p className="text-3xl font-semibold mt-3">{orders}</p></div></div><div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm text-slate-500">Resumo</p><div className="mt-4 h-3 rounded-full bg-slate-100 overflow-hidden"><div className="h-full w-2/3 bg-slate-900" /></div><p className="text-sm text-slate-600 mt-3">Área financeira refeita com visual mais limpo e leitura mais rápida.</p></div></div>;
}

function CouponsSection({ coupons, createCoupon, deleteCoupon }: { coupons: Coupon[]; createCoupon: any; deleteCoupon: any }) {
  const [form, setForm] = useState({ code: '', type: 'percentage' as 'percentage' | 'fixed', value: 0, minValue: 0, maxUses: 100, expiresAt: '', active: true });
  const submit = () => { if (!form.code) return; createCoupon(form); setForm({ code: '', type: 'percentage', value: 0, minValue: 0, maxUses: 100, expiresAt: '', active: true }); };
  return <div className="space-y-6"><div><h2 className="text-2xl font-semibold">Cupons</h2><p className="text-sm text-slate-500">Crie novos cupons e remova os antigos.</p></div><div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4"><div className="grid md:grid-cols-3 gap-4"><Field label="Código"><input value={form.code} onChange={e => setForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))} className="admin-input" /></Field><Field label="Tipo"><select value={form.type} onChange={e => setForm(prev => ({ ...prev, type: e.target.value as 'percentage' | 'fixed' }))} className="admin-input"><option value="percentage">Percentual</option><option value="fixed">Valor fixo</option></select></Field><Field label="Valor"><input type="number" value={form.value} onChange={e => setForm(prev => ({ ...prev, value: Number(e.target.value) }))} className="admin-input" /></Field><Field label="Pedido mínimo"><input type="number" value={form.minValue} onChange={e => setForm(prev => ({ ...prev, minValue: Number(e.target.value) }))} className="admin-input" /></Field><Field label="Máx. usos"><input type="number" value={form.maxUses} onChange={e => setForm(prev => ({ ...prev, maxUses: Number(e.target.value) }))} className="admin-input" /></Field><Field label="Validade"><input type="date" value={form.expiresAt} onChange={e => setForm(prev => ({ ...prev, expiresAt: e.target.value }))} className="admin-input" /></Field></div><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.active} onChange={e => setForm(prev => ({ ...prev, active: e.target.checked }))} /> Cupom ativo</label><Button variant="premium" onClick={submit}>Criar cupom</Button></div><div className="grid gap-4">{coupons.map(coupon => <div key={coupon.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"><div><p className="font-semibold">{coupon.code}</p><p className="text-sm text-slate-500 mt-1">{coupon.type === 'percentage' ? `${coupon.value}% de desconto` : `R$ ${coupon.value.toFixed(2).replace('.', ',')} de desconto`} · mínimo R$ {coupon.minValue.toFixed(2).replace('.', ',')}</p><p className="text-xs text-slate-400 mt-1">Usos: {coupon.usedCount}/{coupon.maxUses} · validade: {coupon.expiresAt || 'sem data'}</p></div><button onClick={() => deleteCoupon(coupon.id)} className="inline-flex items-center gap-1 rounded-xl border border-rose-200 text-rose-600 px-3 py-2 text-xs w-fit"><Trash2 className="w-3.5 h-3.5" /> Excluir</button></div>)}</div></div>;
}

function SettingsSection() {
  return <div><h2 className="text-2xl font-semibold mb-6">Configurações</h2><div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm text-slate-500">Painel simplificado para operação. A área de conteúdo foi removida para deixar tudo mais clean.</p></div></div>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>{children}</label>;
}
