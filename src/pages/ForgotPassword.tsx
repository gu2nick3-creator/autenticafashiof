import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  return (
    <div className="py-16 md:py-24">
      <div className="container max-w-md">
        <ScrollReveal>
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl font-light mb-2">Recuperar Senha</h1>
            <p className="text-sm text-muted-foreground font-body">Enviaremos um link para redefinir sua senha</p>
          </div>
          <form onSubmit={e => e.preventDefault()} className="space-y-4">
            <input type="email" placeholder="Seu e-mail" className="w-full h-11 px-4 border border-border text-sm font-body outline-none focus:border-gold transition-colors bg-background" />
            <Button variant="premium" size="lg" className="w-full" type="submit">Enviar Link</Button>
          </form>
          <p className="text-center text-sm font-body text-muted-foreground mt-6">
            <Link to="/login" className="text-foreground hover:text-gold transition-colors">Voltar ao Login</Link>
          </p>
        </ScrollReveal>
      </div>
    </div>
  );
}
