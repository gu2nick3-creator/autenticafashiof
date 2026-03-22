import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loginCustomer, loginAdmin } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    const okAdmin = await loginAdmin(identifier.trim(), password);
    if (okAdmin) {
      toast({ title: 'Acesso liberado', description: 'Redirecionando para o painel administrativo.' });
      navigate('/admin');
      return;
    }
    const result = loginCustomer(identifier.trim(), password);
    toast({ title: result.ok ? 'Login realizado' : 'Erro ao entrar', description: result.message });
    if (result.ok) navigate('/conta');
  };

  return (
    <div className="py-16 md:py-24"><div className="container max-w-3xl"><ScrollReveal><div className="text-center mb-10"><h1 className="font-display text-3xl font-light mb-2">Entrar</h1><p className="text-sm text-muted-foreground font-body">Acesse sua conta para acompanhar pedidos e liberar preços de revenda.</p></div></ScrollReveal><ScrollReveal><div className="border border-border p-6 md:p-8 bg-cream/30"><h2 className="font-display text-2xl font-light mb-2">Login da Conta</h2><p className="text-sm text-muted-foreground font-body mb-6">Entre com seu e-mail e senha.</p><form onSubmit={handleLogin} className="space-y-4"><input type="text" placeholder="E-mail ou usuário" value={identifier} onChange={e => setIdentifier(e.target.value)} className="w-full h-11 px-4 border border-border text-sm font-body outline-none focus:border-gold transition-colors bg-background" /><input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} className="w-full h-11 px-4 border border-border text-sm font-body outline-none focus:border-gold transition-colors bg-background" /><div className="flex items-center justify-between gap-4 text-xs font-body"><Link to="/recuperar-senha" className="text-gold hover:underline">Esqueceu a senha?</Link><span className="text-muted-foreground">Acesso seguro</span></div><Button variant="premium" size="lg" className="w-full" type="submit">Entrar</Button></form><p className="text-center text-sm font-body text-muted-foreground mt-6">Não tem conta? <Link to="/cadastro" className="text-foreground hover:text-gold transition-colors font-medium">Cadastre-se</Link></p></div></ScrollReveal></div></div>
  );
}
