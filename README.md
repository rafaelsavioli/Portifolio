# Portfólio — Rafael Savioli

Site pessoal de **Rafael Savioli**, desenvolvedor front-end.
Publicação: [rafaelsavioli.dev](https://rafaelsavioli.dev) · Código: [github.com/rafaelsavioli/Portifolio](https://github.com/rafaelsavioli/Portifolio)

---

## O que este site é

Um site estático em **HTML, CSS e JavaScript puro** — sem framework, sem build,
sem dependências. É a primeira coisa que um recrutador vê, então ele é também o
primeiro projeto: a barra é "polido, rápido e responsivo".

## Decisões técnicas

| Decisão | Por quê |
|---|---|
| **Sem framework** | Um portfólio de quem está começando precisa provar que sabe a base. Um build de 200 KB introduziria ruído. |
| **Sem GSAP** | A biblioteca carregava ~70 KB por três animações. `IntersectionObserver` e CSS fazem o mesmo com 0 KB. |
| **Vanilla JS (ES5+)** | Roda em qualquer navegador, inclusive os legados que ainda aparecem em tela de celular. Sem `node_modules`. |
| **CSS custom properties** | Tokens centralizados em `:root`; trocar a identidade visual é editar 8 linhas. |
| **Paleta âmbar sobre grafite** | Contraste medido: `#FAFAF9` sobre `#09090B` passa em WCAG AA com folga. O âmbar só é usado em texto acima de 24px ou como borda — nunca em corpo pequeno sobre fundo escuro. |
| **Sem imagem de placeholder** | Cada imagem de projeto é um print real do sistema rodando. Foto de banco de imagem genérico denuncia portfólio sem projeto real. |

## Acessibilidade

Este site segue WCAG 2.1 nível AA:

- **Skip link** — primeiro elemento focável, leva direto ao conteúdo principal
- **Foco visível** — contorno âmbar de 2px com `outline-offset`, nunca removido
- **Contraste** — todos os pares de cor verificados contra AA (4.5:1 em texto corrido)
- **`prefers-reduced-motion`** — toda animação é desligada quando o sistema pede
- **HTML semântico** — `header` / `nav` / `main` / `section` / `footer`, um único `h1` por página e hierarquia de headings sem salto
- **`aria-current`** — o link da seção visível é marcado para leitores de tela
- **Degradação graciosa** — sem JavaScript, todo o conteúdo permanece legível

## Responsividade

Layout fluido entre **320px e 2560px**, testado em quatro larguras.
Sem scroll horizontal em nenhum ponto de quebra.
Tipografia com `clamp()` — escala junto com a viewport, sem media query solta.

## Estrutura

```
index.html              marcação semântica
assets/
  css/main.css          tokens + componentes + responsivo
  js/main.js            ano, preloader, scrollspy, revelação, copiar email
  img/favicon.svg       ícone em SVG inline
```

## Rodando localmente

Abra `index.html` direto no navegador — não há build.

Para servir com hot reload:

```bash
npx serve .
```

## Publicação

GitHub Pages, conectado ao repositório. Push em `main` publica.

## Licença

MIT.
