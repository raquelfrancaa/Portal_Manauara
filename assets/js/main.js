/* Espera todo o documento HTML ser carregado e interpretado pelo navegador antes de executar o código */
document.addEventListener('DOMContentLoaded', () => {
    /* Exibe uma mensagem no console para confirmar que o sistema JS principal foi carregado com sucesso */
    console.log('Portal Manauara iniciado!');
    
    /* Chama a função que gerencia as chamadas de API para o clima e nível do rio */
    initWidgets();

    /* Chama a função que adiciona interatividade ao formulário de newsletter */
    initNewsletter();

    /* Chama a função que gerencia os filtros da seção de Agenda Cultural */
    initAgenda();

    /* Inicializa a funcionalidade de busca real no front-end */
    initSearch();
});

/* Implementa a lógica de busca funcional com layout dinâmico e agrupamento por seções */
function initSearch() {
    /* Seleciona o campo de entrada de texto e o botão de busca */
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    /* Se o campo de busca não existir na página atual, interrompe a execução */
    if (!searchInput) return;

    /* Configuração do container de resultados dinâmicos */
    const mainContainer = document.querySelector('main.container');
    if (!mainContainer) return;

    const searchResultsContainer = document.createElement('div');
    searchResultsContainer.id = 'search-results-container';
    searchResultsContainer.style.display = 'none';
    searchResultsContainer.style.marginBottom = '40px';
    
    searchResultsContainer.innerHTML = `
        <h2 class="section-title" id="search-title" style="margin-top: 20px;">Resultados da Busca</h2>
        <div id="search-groups-container"></div>
        <div id="no-results-msg" style="display: none; text-align: center; padding: 60px 20px; color: var(--charcoal);">
            <p style="font-size: 1.5rem; margin-bottom: 10px;">🔍</p>
            <p style="font-size: 1.2rem;">Nenhum resultado encontrado para "<strong><span id="search-term-display"></span></strong>".</p>
            <p style="color: var(--gray-medium); margin-top: 10px;">Tente pesquisar por outros termos ou verifique a ortografia.</p>
        </div>
    `;
    mainContainer.prepend(searchResultsContainer);

    /* Função para capturar o conteúdo original da página que deve ser ocultado durante a busca */
    const getOriginalContent = () => Array.from(mainContainer.children).filter(child => child !== searchResultsContainer);

    /* Função interna que executa a filtragem, agrupamento e renderização dos resultados */
    const performSearch = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const groupsContainer = document.getElementById('search-groups-container');
        const noResultsMsg = document.getElementById('no-results-msg');
        const termDisplay = document.getElementById('search-term-display');
        const searchTitle = document.getElementById('search-title');

        /* Se a busca estiver vazia, restaura o layout original */
        if (searchTerm === '') {
            searchResultsContainer.style.display = 'none';
            getOriginalContent().forEach(el => el.style.display = '');
            return;
        }

        /* Oculta o conteúdo original e exibe o container de busca */
        getOriginalContent().forEach(el => el.style.display = 'none');
        searchResultsContainer.style.display = 'block';
        
        /* Limpa resultados anteriores */
        groupsContainer.innerHTML = '';
        
        /* Seleciona todos os elementos que podem conter informações pesquisáveis */
        const cards = document.querySelectorAll('.news-card, .agenda-card, .article-item-cat, .featured-article-cat, .main-feature, .list-news-minimal li, .news-list li');
        
        const resultsBySection = {};
        let hasResults = false;

        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            
            /* Se o termo de busca estiver presente no texto do elemento */
            if (text.includes(searchTerm)) {
                hasResults = true;
                
                /* Determina a qual seção este resultado pertence para agrupamento */
                let sectionName = 'Geral';
                const sectionParent = card.closest('section, aside, .main-content-cat, #hero');
                
                if (sectionParent) {
                    if (sectionParent.id === 'agenda') {
                        sectionName = 'Agenda Cultural';
                    } else if (sectionParent.id === 'hero') {
                        sectionName = 'Destaques';
                    } else {
                        /* Tenta pegar o título da seção de forma dinâmica */
                        const titleEl = sectionParent.querySelector('.section-title, .sidebar-title, h1, h2, h3');
                        if (titleEl) sectionName = titleEl.textContent.trim();
                    }
                }

                if (!resultsBySection[sectionName]) {
                    resultsBySection[sectionName] = [];
                }
                
                /* Evita duplicatas de links dentro da mesma seção */
                const link = card.querySelector('a')?.getAttribute('href');
                const isDuplicate = resultsBySection[sectionName].some(item => item.querySelector('a')?.getAttribute('href') === link);
                
                if (!isDuplicate) {
                    resultsBySection[sectionName].push(card.cloneNode(true));
                }
            }
        });

        /* Se houver resultados, renderiza-os agrupados por seção */
        if (hasResults) {
            /* Define a ordem das seções: Agenda Cultural (Eventos) sempre primeiro */
            const sortedSections = Object.keys(resultsBySection).sort((a, b) => {
                if (a === 'Agenda Cultural') return -1;
                if (b === 'Agenda Cultural') return 1;
                return a.localeCompare(b);
            });

            sortedSections.forEach(sectionName => {
                const sectionGroup = document.createElement('div');
                sectionGroup.className = 'search-group';
                sectionGroup.style.marginBottom = '40px';
                
                const isAgenda = sectionName === 'Agenda Cultural';
                
                /* Layout do cabeçalho da seção dentro da busca */
                sectionGroup.innerHTML = `
                    <h3 style="font-size: 1.1rem; color: var(--laranja-sunset); text-transform: uppercase; margin-bottom: 20px; border-bottom: 2px solid var(--gray-light); padding-bottom: 8px; display: inline-block;">
                        ${sectionName}
                    </h3>
                    <div class="group-content ${isAgenda ? 'agenda-grid' : ''}" style="${isAgenda ? '' : 'display: flex; flex-direction: column; gap: 20px;'}"></div>
                `;
                
                const contentContainer = sectionGroup.querySelector('.group-content');
                
                resultsBySection[sectionName].forEach(item => {
                    if (isAgenda) {
                        /* Para Agenda, mantém o layout de cards original */
                        item.style.display = 'flex';
                        contentContainer.appendChild(item);
                    } else {
                        /* Para notícias, converte para o layout de lista horizontal (search-result-item) */
                        const title = item.querySelector('h2, h3, h4, a')?.textContent || '';
                        
                        /* Prioriza dados de atributos 'data-' (caso de listas minimalistas) */
                        let excerpt = item.getAttribute('data-excerpt') || item.querySelector('p:not(.agenda-info p)')?.textContent || '';
                        let imgSrc = item.getAttribute('data-img');
                        
                        const category = item.querySelector('.category, .card-category')?.textContent || '';
                        const link = item.querySelector('a')?.getAttribute('href') || '#';
                        
                        if (!imgSrc) {
                            const imgEl = item.querySelector('img');
                            if (imgEl) {
                                imgSrc = imgEl.src;
                            } else if (item.classList.contains('main-feature')) {
                                /* Fallback para imagem de fundo do destaque principal */
                                const style = window.getComputedStyle(item);
                                const bg = style.backgroundImage;
                                if (bg && bg !== 'none') {
                                    const match = bg.match(/url\(['"]?(.*?)['"]?\)/);
                                    if (match) imgSrc = match[1];
                                }
                            }
                        }

                        const resultItem = document.createElement('article');
                        /* Adiciona classe no-image se não houver foto para layout adaptativo */
                        resultItem.className = !imgSrc ? 'no-image' : '';
                        
                        resultItem.innerHTML = `
                            <a href="${link}" class="search-result-item ${!imgSrc ? 'no-image' : ''}">
                                <div class="result-img">
                                    ${imgSrc ? `<img src="${imgSrc}" alt="${title}">` : ''}
                                </div>
                                <div class="result-content">
                                    ${category ? `<span class="card-category" style="display: block; margin-bottom: 5px;">${category}</span>` : ''}
                                    <h3 style="margin: 0 0 8px 0; color: var(--charcoal); line-height: 1.3;">${title}</h3>
                                    ${excerpt ? `<p style="font-size: 0.95rem; color: #555; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${excerpt}</p>` : ''}
                                </div>
                            </a>
                        `;
                        contentContainer.appendChild(resultItem);
                    }
                });
                
                groupsContainer.appendChild(sectionGroup);
            });
            
            noResultsMsg.style.display = 'none';
            searchTitle.style.display = 'block';
        } else {
            /* Gerencia a exibição da mensagem de "sem resultados" */
            noResultsMsg.style.display = 'block';
            termDisplay.textContent = searchTerm;
            searchTitle.style.display = 'none';
        }
    };

    /* Adiciona o evento de 'input' para busca em tempo real */
    searchInput.addEventListener('input', performSearch);

    /* Adiciona o evento de clique no botão de busca */
    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            performSearch();
        });
    }
}

/* Função assíncrona para inicializar e exibir dados externos nos widgets do topo */
async function initWidgets() {
    /* Seleciona o elemento HTML onde a temperatura será exibida */
    const weatherEl = document.getElementById('weather-widget');
    /* Seleciona o elemento HTML onde o nível do Rio Negro será exibido */
    const riverEl = document.getElementById('river-level-widget');
    /* Seleciona o elemento HTML onde o status do trânsito será exibido */
    const trafficEl = document.getElementById('traffic-widget');

    /* Verifica se o elemento do clima existe e se a função de busca (definida em api.js) está disponível */
    if (weatherEl && typeof fetchManausWeather === 'function') {
        /* Aguarda o retorno dos dados reais da API de clima */
        const weatherData = await fetchManausWeather();
        /* Se houver dados válidos, insere o ícone e a temperatura no HTML */
        if (weatherData) {
            weatherEl.innerHTML = `${weatherData.icon} ${weatherData.temp}°C Manaus`;
        }
    }

    /* Verifica se o elemento do rio existe e se a função de busca está disponível */
    if (riverEl && typeof fetchRiverLevel === 'function') {
        /* Aguarda o retorno dos dados (simulados ou reais) do nível do rio */
        const riverData = await fetchRiverLevel();
        /* Se houver dados, insere a informação formatada com o nível e o status (subindo/descendo) */
        if (riverData) {
            riverEl.innerHTML = `💧 Rio Negro: ${riverData.level}m (${riverData.status})`;
        }
    }

    /* Verifica se o elemento do trânsito existe e se a função de busca está disponível */
    if (trafficEl && typeof fetchTrafficStatus === 'function') {
        /* Aguarda o retorno dos dados simulados do trânsito */
        const trafficData = await fetchTrafficStatus();
        /* Se houver dados, insere a informação formatada */
        if (trafficData) {
            trafficEl.innerHTML = `${trafficData.icon} Trânsito: ${trafficData.status}`;
        }
    }
}

/* Configura o comportamento do formulário de inscrição na Newsletter */
function initNewsletter() {
    /* Procura pelo formulário de newsletter na página */
    const form = document.querySelector('.newsletter-form');
    /* Se o formulário existir, adiciona um "escutador" de eventos para o envio (submit) */
    if (form) {
        form.addEventListener('submit', (e) => {
            /* Impede que a página seja recarregada ao clicar no botão de envio */
            e.preventDefault();
            /* Pega o valor digitado no campo de e-mail */
            const email = form.querySelector('input').value;
            /* Exibe uma mensagem de confirmação amigável para o usuário */
            alert(`Obrigado! O e-mail ${email} foi cadastrado para receber o Café com Tucumã.`);
            /* Limpa o campo do formulário após o sucesso */
            form.reset();
        });
    }
}

/* Implementa a lógica de filtragem da Agenda Cultural */
function initAgenda() {
    /* Seleciona todos os botões de filtro da agenda */
    const filters = document.querySelectorAll('.filter-btn');
    /* Seleciona todos os cards de evento da agenda */
    const cards = document.querySelectorAll('.agenda-card');

    /* Para cada botão de filtro encontrado, adiciona a funcionalidade de clique */
    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            /* Remove a classe 'active' de todos os botões para "desmarcar" os outros */
            filters.forEach(f => f.classList.remove('active'));
            /* Adiciona a classe 'active' apenas no botão que foi clicado (destaque visual) */
            btn.classList.add('active');

            /* Captura o valor da categoria que deve ser filtrada (ex: 'teatro', 'shows') */
            const filter = btn.getAttribute('data-filter');

            /* Percorre todos os cards de eventos para decidir quais mostrar ou esconder */
            cards.forEach(card => {
                /* Se o filtro for 'todos' ou se a categoria do card coincidir com o filtro selecionado */
                if (filter === 'todos' || card.getAttribute('data-category') === filter) {
                    /* Exibe o card usando flexbox */
                    card.style.display = 'flex';
                } else {
                    /* Esconde o card que não pertence à categoria selecionada */
                    card.style.display = 'none';
                }
            });
        });
    });
}


