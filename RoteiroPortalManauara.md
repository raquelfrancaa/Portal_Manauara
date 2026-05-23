# Roteiro de Desenvolvimento: Portal Manauara (Versão Atualizada)

Este documento é o guia mestre de contexto para o desenvolvimento do **Portal Manauara**, consolidando visão de produto, requisitos técnicos, estrutura de arquivos e design de interface.

---

## 1. Visão Geral do Produto
- **Nome:** Portal Manauara
- **Proposta:** Portal de notícias focado em Manaus/AM, unindo notícias urgentes (hard news) com guia de serviços e lazer.
- **Público-Alvo:** Moradores locais, turistas, investidores e manauaras residentes fora da cidade.

## 2. Arquitetura de Conteúdo (Editorias)
1. **Cotidiano & Segurança:** Bairros, trânsito, infraestrutura e plantão policial.
2. **Política:** Prefeitura, Câmara Municipal (CMM), Governo e Assembleia (ALEAM).
3. **Guia Manaus (Lazer):** Bares, restaurantes, casas de show, gastronomia e flutuantes.
4. **Cultura:** Agenda do Teatro Amazonas, festivais e folclore local.
5. **Turismo & Esportes:** Ecoturismo fluvial e cobertura dos times locais (Barezão).

## 3. Identidade Visual e UX
- **Paleta de Cores:**
    - *Verde Manaus (#005448):* Cor principal (identidade institucional).
    - *Laranja Sunset (#EC6907):* Cor de destaque (CTA, Alertas, Botões).
    - *Charcoal (#1E293B):* Textos e contrastes.
- **Tipografia:** Montserrat (Títulos/Manchetes) e Open Sans (Corpo de texto).
- **Abordagem:** Mobile-First (Design focado em dispositivos móveis).

## 4. Funcionalidades e Diferenciais
- **Repórter Manauara:** Canal direto via WhatsApp para envio de pautas pelo cidadão.
- **Central de Utilidade Pública:** Widgets com Nível do Rio Negro, Trânsito e Previsão do Tempo.
- **Newsletter "Café com Tucumã":** Resumo diário matinal.
- **Agenda Interativa:** Filtros inteligentes para eventos culturais.

## 5. Especificação Técnica (Vanilla Stack)
- **Tecnologias:** HTML5, CSS3 e JavaScript Puro (Sem frameworks ou CMS).
- **SEO Local:** Implementação de Schema.org (NewsArticle) e foco em palavras-chave regionais.
- **Performance:** Carregamento modular e otimização de imagens (WebP).

## 6. Estrutura de Diretórios Profissional (Atualizada)
```text
portal-manauara/
├── index.html                # Home Page
├── assets/
│   ├── css/                  # modular: reset.css, variables.css, global.css, header.css, home.css
│   │   └── pages/            # CSS específico para cada página interna
│   ├── js/                   # modular: main.js, menu.js, api.js, noticia.js, contato.js
│   ├── img/                  # logos, icons, backgrounds
│   └── fonts/                # Arquivos de fontes locais
├── pages/                    
│   ├── noticias/             # Conteúdos dinâmicos (HTML puro)
│   ├── categoria.html
│   ├── noticia-interna.html  # Template mestre dinâmico
│   ├── quem-somos.html
│   └── contato.html
└── components/               # Fragmentos HTML
```

## 7. Arquitetura Técnica Implementada (Atualizada)
- **Carregamento Dinâmico de Notícias:** Sistema Vanilla JS que carrega arquivos HTML da pasta `/noticias/` para um template único (`noticia-interna.html`), permitindo escalabilidade sem CMS. Suporte para vídeos responsivos do YouTube incorporados diretamente no conteúdo.
- **Integração de Clima e Utilidade:** API Open-Meteo para clima em tempo real e sistema de **Backend Mock (JSON)** para atualização simplificada do nível do Rio Negro sem necessidade de alteração de código.
- **Separação de Preocupações:** Código HTML, CSS e JS 100% separados em arquivos específicos. Organização profissional com subpastas para estilos de páginas internas (`assets/css/pages/`) e dados (`assets/data/`).
- **Documentação Técnica Universal:** 100% do código-fonte do projeto (incluindo a Home, todos os arquivos de notícias da pasta `/noticias/`, resets e estilos de páginas) está documentado linha por linha. Cada instrução possui um comentário explicativo, tornando o projeto um guia de referência técnica completo e didático.
- **Interatividade e UX:** Implementação de filtros inteligentes na Agenda Cultural, sistema de busca funcional no cabeçalho e formulários com feedback ao usuário via JS puro.


## 8. Status do Desenvolvimento (Checklist Atualizado)
- [x] Definição de Identidade Visual (Cores e Fontes).
- [x] Criação da Estrutura de Diretórios e Separação de Arquivos (HTML/CSS/JS).
- [x] Implementação do Reset e Variáveis CSS.
- [x] Layout Base da Home (Header, Hero, Newsletter, Footer).
- [x] SEO Local e Implementação de Schema.org.
- [x] Template Mestre de Notícia Interna com Carregamento Dinâmico e Suporte a Vídeos.
- [x] Página de Categoria (Template).
- [x] Páginas Institucionais: "Quem Somos" e "Contato".
- [x] Integração de APIs Reais (Clima de Manaus) e Dados Externos (Nível do Rio).
- [x] Funcionalidade de Busca e Newsletter (Feedback JS).
- [x] Agenda Cultural com filtros interativos.
- [x] Documentação técnica completa de 100% das linhas de código do projeto.

## 9. Próximos Passos
1. Otimizar carregamento de imagens com `loading="lazy"`.
2. Implementar busca funcional real (filtro de cards no front-end).
3. Gerar sitemap.xml para SEO.
4. Implementar sistema de compartilhamento social (Botões flutuantes).


