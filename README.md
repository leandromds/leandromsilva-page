# leandromsilva-page

Página pessoal e currículo online de **Leandro Silva**, Engenheiro Front-End com 10 anos de experiência construindo interfaces para SaaS, ERPs, e-commerce e mobile.

## Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| [Tailwind CSS](https://tailwindcss.com) | v3.4 | Estilização via utility classes |
| [Autoprefixer](https://github.com/postcss/autoprefixer) | v10.5 | Prefixos CSS cross-browser |
| [PostCSS](https://postcss.org) | (via tailwindcss) | Pipeline de build CSS |
| [Wrangler](https://developers.cloudflare.com/workers/wrangler/) | v4+ | Deploy via Cloudflare Workers |

### Fontes (Google Fonts)
- **Fraunces** — tipografia display/títulos
- **Geist** — texto corrido (sans-serif)
- **Geist Mono** — código e elementos mono

## Estrutura do projeto

```
leandromsilva-page/
├── assets/
│   ├── leandro.jpg                    # Foto de perfil
│   ├── logo.svg                       # Logo do site
│   ├── tailwind.css                   # CSS gerado (não editar manualmente)
│   └── Leandro_Manoel_da_Silva_CV.pdf # Currículo em PDF
├── dist/                              # Pasta de build (gerada automaticamente, não commitada)
│   ├── index.html
│   └── assets/
├── .browserslistrc                    # Targets de browsers para Autoprefixer
├── .gitignore
├── _headers                           # Headers HTTP para Cloudflare Pages
├── index.html                         # Página principal (único HTML do projeto)
├── input.css                          # Ponto de entrada do Tailwind CSS
├── package.json
├── postcss.config.js                  # Configuração PostCSS
├── tailwind.config.js                 # Tema customizado do Tailwind
└── wrangler.toml                      # Configuração de deploy no Cloudflare
```

## Desenvolvimento local

### Pré-requisitos

- [Node.js](https://nodejs.org) v18+
- npm v9+

### Instalação

```bash
npm install
```

### Modo watch (desenvolvimento)

Inicia o Tailwind em modo watch — o CSS é regenerado automaticamente a cada alteração no `index.html`:

```bash
npm run dev
```

Depois abra o `index.html` diretamente no navegador, ou use uma extensão como [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) no VS Code.

### Build para produção

Gera o CSS minificado e copia os arquivos necessários para `dist/`:

```bash
npm run build
```

A pasta `dist/` conterá apenas os arquivos a serem servidos:
```
dist/
├── index.html
└── assets/
    ├── tailwind.css
    ├── logo.svg
    ├── leandro.jpg
    └── Leandro_Manoel_da_Silva_CV.pdf
```

## Deploy (Cloudflare)

O projeto é hospedado no **Cloudflare Workers** com static assets.

### Configuração no Cloudflare Dashboard

| Campo | Valor |
|---|---|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Node.js version | `22` |

O deploy é acionado automaticamente a cada push na branch `main`.

### Como funciona

1. `npm run build` → gera o CSS otimizado e copia os arquivos para `dist/`
2. `npx wrangler deploy` → empacota e publica apenas o conteúdo de `dist/` no Cloudflare (conforme `wrangler.toml`)

## Tema customizado (Tailwind)

Cores e tipografia definidas em `tailwind.config.js`:

```js
colors: {
  ink:        "#0F1419",  // texto principal
  "navy-900": "#1B2F4A",  // destaque escuro
  "navy-600": "#3B5474",  // destaque médio
  "slate-500": "#6B7280", // texto secundário
  "slate-300": "#C4C8CE", // bordas
  "slate-200": "#E5E7EB", // bordas suaves
  "slate-100": "#ECEDEF", // fundos suaves
  paper:      "#FAFAF7",  // fundo principal
}
```

## Atualizar o currículo PDF

Substitua o arquivo `assets/Leandro_Manoel_da_Silva_CV.pdf` pela versão mais recente e faça push:

```bash
git add assets/Leandro_Manoel_da_Silva_CV.pdf
git commit -m "chore: update curriculo PDF"
git push
```

O Cloudflare detecta o push e realiza o deploy automaticamente.

## Licença

Todos os direitos reservados © Leandro Manoel da Silva.
