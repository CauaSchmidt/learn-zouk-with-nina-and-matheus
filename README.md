# Learn Zouk with Nina & Matheus

Novo site do **learnzouk.com** (prévia).

Site estático: HTML, CSS e JavaScript puros, sem build. Funciona em qualquer hospedagem (GitHub Pages, Netlify, Cloudflare Pages).

## Arquivos

| Arquivo | O que tem |
|---|---|
| `index.html` | Estrutura e textos do site |
| `styles.css` | Visual: cores, fontes, animações |
| `main.js` | Interações: troca de cor ao rolar, menu, agenda, vídeos |
| `data.js` | **Conteúdo editável**: agenda, vídeos, contatos e links |

## Atualizar agenda, vídeos ou contatos

Edite só o `data.js`. As instruções estão no começo do arquivo. Eventos que já passaram somem sozinhos da agenda.

## Ver no computador

Abra o `index.html` no navegador, ou rode um servidor local na pasta:

```
npx serve .
```

## Antes de publicar no learnzouk.com

- Trocar `<meta name="robots" content="noindex, nofollow">` para `index, follow` no `index.html`
- Baixar as fotos do Imgur para dentro do projeto
- Confirmar informações dos cursos, datas de 2027 e números (320+ alunos, 13+ países)
