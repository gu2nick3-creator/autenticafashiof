import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function Register() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { registerCustomer } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast({ title: 'Senhas diferentes', description: 'Confirme a mesma senha nos dois campos.' });
      return;
    }

    const result = registerCustomer({
      name: form.name,
      email: form.email,
      phone: form.phone,
      cpf: form.cpf,
      password: form.password,
    });

    toast({ title: result.ok ? 'Conta criada' : 'Não foi possível criar', description: result.message });
    if (result.ok) navigate('/conta');
  };

  return (
    <div className="py-16 md:py-24">
      <div className="container max-w-md">
        <ScrollReveal>
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl font-light mb-2">Criar Conta</h1>
            <p className="text-sm text-muted-foreground font-body">Cadastre-se para acompanhar pedidos e salvar seus endereços.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Nome completo" value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} className="w-full h-11 px-4 border border-border text-sm font-body outline-none focus:border-gold transition-colors bg-background" />
            <input type="email" placeholder="E-mail" value={form.email} onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))} className="w-full h-11 px-4 border border-border text-sm font-body outline-none focus:border-gold transition-colors bg-background" />
            <input type="tel" placeholder="Telefone" value={form.phone} onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))} className="w-full h-11 px-4 border border-border text-sm font-body outline-none focus:border-gold transition-colors bg-background" />
            <input type="text" placeholder="CPF" value={form.cpf} onChange={e => setForm(prev => ({ ...prev, cpf: e.target.value }))} className="w-full h-11 px-4 border border-border text-sm font-body outline-none focus:border-gold transition-colors bg-background" />
            <input type="password" placeholder="Senha" value={form.password} onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))} className="w-full h-11 px-4 border border-border text-sm font-body outline-none focus:border-gold transition-colors bg-background" />
            <input type="password" placeholder="Confirmar senha" value={form.confirmPassword} onChange={e => setForm(prev => ({ ...prev, confirmPassword: e.target.value }))} className="w-full h-11 px-4 border border-border text-sm font-body outline-none focus:border-gold transition-colors bg-background" />
            <Button variant="premium" size="lg" className="w-full" type="submit">Criar Conta</Button>
          </form>
          <p className="text-center text-sm font-body text-muted-foreground mt-6">
            Já tem conta? <Link to="/login" className="text-foreground hover:text-gold transition-colors font-medium">Entrar</Link>
          </p>
        </ScrollReveal>
      </div>
    </div>
  );
}
