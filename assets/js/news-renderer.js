/**
 * news-renderer.js - Lógica para carregar dados e renderizar os componentes de notícias.
 */

document.addEventListener('DOMContentLoaded', async () => {
    const containers = document.querySelectorAll('[data-component="news-section"]');
    if (containers.length === 0) return;

    /* Determina o caminho base para o JSON e imagens */
    const isPage = window.location.pathname.includes('/pages/');
    const jsonPath = isPage ? '../assets/data/news.json' : 'assets/data/news.json';
    const basePath = isPage ? '../' : '';

    try {
        const response = await fetch(jsonPath);
        if (!response.ok) throw new Error('Falha ao carregar notícias');
        const allNews = await response.json();

        containers.forEach(container => {
            const type = container.getAttribute('data-type'); // grid, list, featured
            const category = container.getAttribute('data-category');
            const limit = parseInt(container.getAttribute('data-limit')) || 999;
            const isFeaturedOnly = container.hasAttribute('data-featured-only');

            /* Filtra as notícias com base nos atributos do container */
            let filteredNews = allNews.filter(item => {
                const matchCategory = !category || item.section === category;
                
                if (isFeaturedOnly) {
                    /* Se o container só quer destaques, retorna apenas os itens marcados */
                    return matchCategory && item.isFeatured;
                } else {
                    /* Se for lista, grid ou minimal, exclui os itens que já são destaque 
                       para evitar duplicação na mesma página */
                    return matchCategory && !item.isFeatured;
                }
            });

            /* Limita a quantidade de itens */
            filteredNews = filteredNews.slice(0, limit);

            /* Renderiza os cards conforme o tipo solicitado */
            let html = '';
            filteredNews.forEach(news => {
                if (type === 'grid') {
                    html += NewsCard.renderGrid(news, basePath);
                } else if (type === 'list') {
                    html += NewsCard.renderList(news, basePath);
                } else if (type === 'featured') {
                    html += NewsCard.renderFeatured(news, basePath, !isPage);
                } else if (type === 'minimal') {
                    html += NewsCard.renderMinimal(news, basePath);
                }
            });

            container.innerHTML = html;
        });

        /* Re-inicializa a busca para incluir os novos elementos dinâmicos se necessário */
        /* Mas como a busca no main.js já seleciona os cards no momento da busca, 
           ela deve funcionar automaticamente. */

    } catch (error) {
        console.error('Erro ao renderizar notícias:', error);
    }
});
