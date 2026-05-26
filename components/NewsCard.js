/**
 * NewsCard.js - Fábrica de componentes de cards de notícias.
 * Contém funções para renderizar os três tipos de cards do portal.
 */

const NewsCard = {
    /**
     * Renderiza o Card "Quadradinho" (Grid Card) - Usado na Home.
     * @param {Object} data - Dados da notícia.
     * @param {string} basePath - Prefixo para os caminhos de imagem e links.
     */
    renderGrid(data, basePath = '') {
        const link = `${basePath}pages/noticia-interna.html?id=${data.id}`;
        const imgSrc = `${basePath}${data.image}`;

        return `
            <article class="news-card">
                <a href="${link}">
                    <div class="card-img">
                        <img src="${imgSrc}" alt="${data.title}" loading="lazy">
                    </div>
                    <div class="card-content">
                        <span class="card-category">${data.category}</span>
                        <h3>${data.title}</h3>
                        <p>${data.subtitle}</p>
                    </div>
                </a>
            </article>
        `;
    },

    /**
     * Renderiza o Card "Esticadinho" (List Card) - Usado nas páginas de Categoria.
     * @param {Object} data - Dados da notícia.
     * @param {string} basePath - Prefixo para os caminhos de imagem e links.
     */
    renderList(data, basePath = '') {
        /* Se estiver em uma página dentro de /pages/, o link para noticia-interna é local */
        const link = `noticia-interna.html?id=${data.id}`;
        /* A imagem precisa voltar um nível se estiver em /pages/ */
        const imgSrc = `../${data.image}`;

        return `
            <article class="article-item-cat">
                <a href="${link}">
                    <div class="card-img">
                        <img src="${imgSrc}" alt="${data.title}" loading="lazy">
                    </div>
                    <div class="card-content">
                        <span class="card-category">${data.category}</span>
                        <h3>${data.title}</h3>
                        <p>${data.subtitle}</p>
                    </div>
                </a>
            </article>
        `;
    },

    /**
     * Renderiza o Card de Destaque (Featured Card).
     * @param {Object} data - Dados da notícia.
     * @param {string} basePath - Prefixo para os caminhos de imagem e links.
     * @param {boolean} isHome - Se é o destaque da Home (layout diferente).
     */
    renderFeatured(data, basePath = '', isHome = false) {
        const link = isHome ? `${basePath}pages/noticia-interna.html?id=${data.id}` : `noticia-interna.html?id=${data.id}`;
        const imgSrc = isHome ? `${basePath}${data.image}` : `../${data.image}`;

        if (isHome) {
            /* Estilo Hero da Home com background image */
            return `
                <article class="main-feature" style="background: linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url('${imgSrc}'); background-size: cover; background-position: center;">
                    <span class="category">${data.category}</span>
                    <h2>${data.title}</h2>
                    <p style="color: var(--white); margin-bottom: 20px;">${data.subtitle}</p>
                    <a href="${link}" class="btn btn-primary" style="width: fit-content;">Ler mais</a>
                </article>
            `;
        } else {
            /* Estilo Destaque das páginas de categoria */
            return `
                <article class="featured-article-cat">
                    <img src="${imgSrc}" alt="${data.title}" loading="lazy">
                    <div class="featured-info">
                        <span class="card-category">Destaque</span>
                        <h2>${data.title}</h2>
                        <p>${data.subtitle}</p>
                        <a href="${link}" class="btn btn-primary" style="margin-top: 15px;">Ler mais</a>
                    </div>
                </article>
            `;
        }
    },

    /**
     * Renderiza o item de lista minimalista - Usado na seção Política da Home.
     * @param {Object} data - Dados da notícia.
     * @param {string} basePath - Prefixo para os caminhos de imagem e links.
     */
    renderMinimal(data, basePath = '') {
        const link = `${basePath}pages/noticia-interna.html?id=${data.id}`;
        
        return `
            <li data-category="${data.category}" data-img="${basePath}${data.image}" data-excerpt="${data.subtitle}">
                <a href="${link}">${data.title}</a>
            </li>
        `;
    }
};

/* Torna o componente disponível globalmente */
window.NewsCard = NewsCard;
