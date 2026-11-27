# Learn Zouk with Nina & Matheus

Novo site do **learnzouk.com** (prévia).

Site estático: HTML, CSS e JavaScript puros, sem build. Funciona em qualquer hospedagem (GitHub Pages, Netlify, Cloudflare Pages).

## Arquivos

| Arquivo | O que tem |
|---|---|
| `index.html` | Estrutura e textos do site |
| `styles.css` | Visual: cores, fontes, animações |
| `main.js` | Interações: troca de cor ao rolar, menu, calendário, vídeos, troca de idioma |
| `data.js` | **Conteúdo editável**: agenda, cursos, vídeos, contatos e links |
| `i18n.js` | Traduções em português e espanhol (o inglês fica no `index.html`) |

## Atualizar agenda, cursos, vídeos ou contatos

Edite só o `data.js`. As instruções estão no começo do arquivo.

- **Calendário:** cada evento entra no fim de semana em que acontece. Fim de semana sem evento aparece como livre, com botão de convite pelo WhatsApp.
- **Cursos:** ficam na lista `products`, com o link de compra no Lab.
- **Mentoria:** quando tiver o link do Choreo Journey no Lab, coloque em `mentoring.url`.

## Idiomas

O site abre em inglês e tem botões EN / PT / ES no topo. A escolha fica salva no navegador da pessoa. Para mudar uma tradução, edite o `i18n.js`.

## Ver no computador

Abra o `index.html` no navegador, ou rode um servidor local na pasta:

```
npx serve .
```

## Antes de publicar no learnzouk.com

- Trocar `<meta name="robots" content="noindex, nofollow">` para `index, follow` no `index.html`
- Baixar as fotos do Imgur para dentro do projeto
- Confirmar informações dos cursos, datas de 2027 e números (320+ alunos, 13+ países)
