# Soft Spend Diary

Um aplicativo de controle de gastos pessoais desenvolvido com React, TypeScript e Tailwind CSS.

## Sobre o Projeto

O Soft Spend Diary é uma aplicação web para controle de gastos pessoais, permitindo registrar e acompanhar despesas de diferentes categorias (Ifood e Restaurante) para múltiplas pessoas.

## Funcionalidades

- 📊 Dashboard com visão geral dos gastos mensais
- 📅 Calendário interativo para visualizar gastos por data
- 👥 Suporte a múltiplas pessoas (Ana e Lucas)
- 🍕 Categorização de gastos (Ifood e Restaurante)
- 📱 Interface responsiva e moderna
- 🔐 Sistema de autenticação simples

## Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

## Como Executar

### Opção 1: Execução Local

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Build para produção
npm run build
```

### Opção 2: Execução com Docker

#### Usando o script facilitador:
```bash
# Tornar o script executável (primeira vez)
chmod +x docker-scripts.sh

# Ambiente de desenvolvimento
./docker-scripts.sh dev

# Ambiente de produção
./docker-scripts.sh prod

# Preview de produção
./docker-scripts.sh preview

# Ver todos os comandos disponíveis
./docker-scripts.sh help
```

#### Usando Docker Compose diretamente:
```bash
# Desenvolvimento
docker-compose --profile dev up --build

# Produção
docker-compose --profile prod up --build -d

# Preview
docker-compose --profile preview up --build -d
```

#### Usando Docker diretamente:
```bash
# Build da imagem
docker build -t expense-tracker-app .

# Executar container de desenvolvimento
docker run -p 8080:8080 -v $(pwd):/app expense-tracker-app

# Executar container de produção
docker run -p 80:80 expense-tracker-app
```

## Autenticação

Para acessar o sistema, use a senha: `123456`

## Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
├── contexts/           # Contextos React
├── hooks/              # Custom hooks
├── pages/              # Páginas da aplicação
├── lib/                # Utilitários
└── ui/                 # Componentes de UI (shadcn/ui)
```

## Desenvolvimento

Este projeto foi desenvolvido como uma demonstração de habilidades em React e TypeScript, com foco em uma interface moderna e intuitiva para controle financeiro pessoal.
