# Autêntica Fashion Frontend

Frontend em React + Vite pronto para Git e Vercel, sem dados mock de catálogo.

## O que já está limpo
- catálogo inicia pelos produtos da API
- painel ADM usa login do backend
- pedidos do painel vêm da API
- cadastro de produto envia para a API
- cupons usam a API
- checkout cria pedido na API
- frete consulta a API

## O que permanece local no navegador
- carrinho
- favoritos
- conta simples de cliente

## Variáveis de ambiente
Crie um arquivo `.env` com:

```env
VITE_API_BASE_URL=https://api.seudominio.com
VITE_INFINITEPAY_TAG=$autentica_fashion
VITE_INFINITEPAY_LINK=https://linknabio.gg/autentica_fashion
```

## Rodando localmente
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Vercel
- framework: Vite
- build command: `npm run build`
- output directory: `dist`
