# ScanIA

Aplicativo React Native + Expo para fotografar notas fiscais, enviar a imagem ao Supabase Storage privado e extrair os dados por uma Supabase Edge Function com IA.

## Requisitos
- Node.js LTS 22+
- Expo Go no celular
- Projeto Supabase
- (Opcional, para IA real) chave Anthropic

## Instalação
```bash
npm install
npx expo install --fix
cp .env.example .env
```
Preencha `.env` com a URL e a chave pública do Supabase. Nunca coloque `service_role` ou chave Anthropic em variáveis `EXPO_PUBLIC_`.

## Backend
1. Execute `supabase/schema.sql` no SQL Editor do Supabase.
2. Crie o projeto Supabase e copie Project URL + chave publishable/anon para `.env`.
3. Configure a autenticação por e-mail no painel.
4. Faça login na CLI e vincule o projeto: `npx supabase login`, `npx supabase link --project-ref SEU_PROJECT_REF`.
5. Para começar sem custo de IA: `npx supabase secrets set MOCK_AI=true`.
6. Publique: `npx supabase functions deploy scan-receipt` (se houver erro de Docker, acrescente `--use-api`).

## Executar
```bash
npm run typecheck
npm test
npx expo start -c
```
Abra com Expo Go em um celular real. O projeto foi organizado seguindo o guia ScanIA do IESB; revise versões de dependências com `npx expo install --fix` antes de executar.

## IA real (opcional)
No Supabase, configure `MOCK_AI=false`, `ANTHROPIC_API_KEY` e, se desejar, `ANTHROPIC_MODEL`. A chave fica somente nos secrets da Edge Function.
