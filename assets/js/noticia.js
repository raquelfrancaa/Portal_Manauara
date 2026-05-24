/**
 * noticia.js
 * Script responsável pelo sistema de templates dinâmicos.
 * Carrega o conteúdo HTML de uma notícia específica dentro da página mestre (noticia-interna.html).
 */

/* Executa o script assim que a estrutura do documento estiver pronta */
document.addEventListener('DOMContentLoaded', () => {
    /* Analisa os parâmetros de busca na URL (ex: ?id=nome-da-noticia) */
    const params = new URLSearchParams(window.location.search);
    /* Obtém especificamente o valor associado à chave 'id' */
    const noticiaId = params.get('id');
    /* Seleciona o elemento onde o conteúdo da notícia será inserido */
    const container = document.getElementById('noticia-content');

    /* Verifica se um ID de notícia foi fornecido na URL */
    if (!noticiaId) {
        /* Caso não exista ID, exibe uma mensagem de erro amigável e link de retorno */
        container.innerHTML = '<h2>Notícia não encontrada.</h2><p>Por favor, volte para a <a href="../index.html">página inicial</a>.</p>';
        return;
    }

    /* Define o caminho relativo para encontrar o arquivo HTML da notícia na pasta 'noticias' */
    const path = `./noticias/${noticiaId}.html`;

    /* Inicia a requisição para buscar o arquivo de conteúdo via rede (AJAX/Fetch) */
    fetch(path)
        .then(response => {
            /* Verifica se a resposta foi bem-sucedida (status 200). Se não, dispara um erro. */
            if (!response.ok) {
                throw new Error('Notícia não encontrada');
            }
            /* Transforma a resposta bruta do arquivo em texto puro (HTML) */
            return response.text();
        })
        .then(html => {
            /* Insere o conteúdo HTML carregado dentro do container principal da página */
            container.innerHTML = html;
            
            /* Seleciona o elemento de título da notícia recém-carregado */
            const titleElement = container.querySelector('.article-title');
            /* Se o título existir, atualiza a tag <title> do navegador para refletir o nome da notícia */
            if (titleElement) {
                document.title = `${titleElement.innerText} - Portal Manauara`;
                
                /* Gera dinamicamente os dados estruturados (Schema.org) para SEO */
                updateNewsSchema(container, noticiaId);
            }
        })
        .catch(error => {
            /* Captura e loga no console qualquer erro que ocorra durante o processo de carregamento */
            console.error('Erro ao carregar a notícia:', error);
            /* Exibe uma mensagem de erro visual para o usuário no lugar do conteúdo */
            container.innerHTML = '<h2>Erro ao carregar a notícia.</h2><p>O conteúdo pode ter sido removido ou o link está incorreto.</p>';
        });
});

/**
 * Cria e insere um bloco de script JSON-LD com o Schema NewsArticle
 * para melhorar o SEO das notícias carregadas dinamicamente.
 */
function updateNewsSchema(container, id) {
    const title = container.querySelector('.article-title')?.innerText;
    const excerpt = container.querySelector('.article-excerpt')?.innerText;
    const category = container.querySelector('.article-category')?.innerText;
    const date = container.querySelector('time')?.getAttribute('datetime');
    const image = container.querySelector('.article-hero-img')?.src;

    const schemaData = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": title,
        "description": excerpt,
        "articleSection": category,
        "datePublished": date,
        "author": {
            "@type": "Organization",
            "name": "Portal Manauara"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Portal Manauara",
            "logo": {
                "@type": "ImageObject",
                "url": "https://portalmanauara.com.br/assets/img/logo.png"
            }
        },
        "image": image,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": window.location.href
        }
    };

    /* Remove schema anterior se existir para evitar duplicidade */
    const oldSchema = document.getElementById('dynamic-news-schema');
    if (oldSchema) oldSchema.remove();

    /* Cria o novo elemento de script */
    const script = document.createElement('script');
    script.id = 'dynamic-news-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);
}

