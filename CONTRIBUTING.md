# Contribuindo para o Expense Tracker App

Obrigado por considerar contribuir para o Expense Tracker App! Este documento fornece diretrizes para contribuições.

## Como Contribuir

### 1. Fork o Projeto

1. Faça um fork do repositório
2. Clone seu fork localmente
3. Crie uma branch para sua feature

```bash
git clone https://github.com/seu-usuario/expense-tracker-app.git
cd expense-tracker-app
git checkout -b feature/nova-funcionalidade
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Execute o Projeto

```bash
npm run dev
```

### 4. Faça suas Alterações

- Mantenha o código limpo e bem documentado
- Siga as convenções de nomenclatura existentes
- Teste suas alterações localmente

### 5. Commit e Push

```bash
git add .
git commit -m "feat: adiciona nova funcionalidade"
git push origin feature/nova-funcionalidade
```

### 6. Abra um Pull Request

1. Vá para o repositório original
2. Clique em "New Pull Request"
3. Selecione sua branch
4. Descreva suas alterações

## Padrões de Código

- Use TypeScript para todo o código
- Siga as convenções do ESLint
- Mantenha componentes pequenos e focados
- Use Tailwind CSS para estilização

## Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
├── contexts/      # Contextos React
├── hooks/         # Custom hooks
├── pages/         # Páginas da aplicação
├── lib/           # Utilitários
└── ui/            # Componentes de UI (shadcn/ui)
```

## Reportando Bugs

Se você encontrar um bug, por favor:

1. Verifique se já existe uma issue sobre o problema
2. Crie uma nova issue com:
   - Descrição clara do bug
   - Passos para reproduzir
   - Comportamento esperado vs atual
   - Screenshots (se aplicável)

## Sugerindo Melhorias

Para sugerir melhorias:

1. Abra uma issue com a tag "enhancement"
2. Descreva a funcionalidade desejada
3. Explique por que seria útil

## Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a licença MIT.
