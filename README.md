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

## Ao publicar uma mudança

No `index.html`, os arquivos `styles.css`, `data.js`, `i18n.js` e `main.js` são carregados com `?v=...` no final. **Troque esse número a cada publicação** (por exemplo, `?v=20261128-1`). Sem isso, quem já abriu o site pode ver a página nova misturada com arquivos antigos guardados no navegador, e o visual quebra.

## Idiomas

O site abre em inglês e tem botões EN / PT / ES no topo. A escolha fica salva no navegador da pessoa. Para mudar uma tradução, edite o `i18n.js`.

## Ver no computador

Abra o `index.html` no navegador, ou rode um servidor local na pasta:

```
npx serve .
```

## Antes de publicar no learnzouk.com

- (feito) o site já está liberado para o Google
- Baixar as fotos do Imgur para dentro do projeto
- Preencher o calendário de 2027 (com site e Instagram de cada evento) e trocar fotos e vídeos

## Onde o site está publicado

- **learnzouk.com** e **www.learnzouk.com**: Cloudflare Pages, projeto `learnzouk`, na conta Cloudflare da Nina (envio direto dos arquivos).
- Domínio registrado na Spaceship (conta da Nina). DNS e encaminhamento de e-mail na Cloudflare dela: tudo que chega em @learnzouk.com vai para ninaandmatheus@gmail.com.
- Para publicar uma mudança: na Cloudflare, Workers & Pages → learnzouk → Create deployment, e enviar os arquivos `index.html`, `styles.css`, `main.js`, `data.js`, `i18n.js` e `sw.js` (lembrando de trocar o `?v=`).
- O `sw.js` desinstala o service worker do site antigo nos navegadores de quem já visitou. Não apagar.
- `_redirects`: leva os endereços do site antigo (`/about`, `/performances`, `/contact`, `/courses`, `/school`) para as seções certas. `404.html` é a página de "não encontrado".
- `school.learnzouk.com` redireciona para os cursos no Lab (regra de redirecionamento na Cloudflare).
- Estatísticas de visitas: Cloudflare Web Analytics, ligado no projeto `learnzouk` (Workers & Pages → learnzouk → Metrics).
- E-mail: registro DMARC `p=quarantine` contra e-mails falsos em nome do @learnzouk.com.
- A cópia no GitHub Pages foi desligada; o endereço oficial é só o learnzouk.com.
- Fotos: ficam em `img/` em WebP (480, 800 e 1280 px). As originais estão em `img/originais` e não precisam ser publicadas. Foto nova: gerar os 3 tamanhos e usar `srcset` como nas outras.
- Fontes: em `fonts/` (Anybody e Newsreader), carregadas pelo `styles.css`. O site não usa mais o Google Fonts.
- `_headers`: cabeçalhos de segurança (CSP) e cache. Se o pequeno script do `<head>` mudar, recalcular o hash sha256 que está lá.
- Ao montar o zip para a Cloudflare no Windows, usar `tar -a -cf site.zip ...` (o Compress-Archive grava as pastas com barra invertida e quebra os caminhos).
