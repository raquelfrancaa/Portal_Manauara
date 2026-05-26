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
    const performSearch = async () => {
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
        
        try {
            /* Determina o caminho base para o JSON e imagens */
            const isPage = window.location.pathname.includes('/pages/');
            const jsonPath = isPage ? '../assets/data/news.json' : 'assets/data/news.json';
            const basePath = isPage ? '../' : '';
            
            const response = await fetch(jsonPath);
            if (!response.ok) throw new Error('Falha ao carregar notícias para busca');
            const allNews = await response.json();
            
            const resultsBySection = {};
            let hasResults = false;

            /* Filtra todas as notícias do JSON com base no termo */
            allNews.forEach(item => {
                const searchableText = `${item.title} ${item.subtitle} ${item.category} ${item.section}`.toLowerCase();
                
                if (searchableText.includes(searchTerm)) {
                    hasResults = true;
                    const sectionName = item.section || 'Geral';
                    
                    if (!resultsBySection[sectionName]) {
                        resultsBySection[sectionName] = [];
                    }
                    resultsBySection[sectionName].push(item);
                }
            });

            /* Se houver resultados, renderiza-os agrupados por seção */
            if (hasResults) {
                /* Ordena as seções para exibição */
                const sortedSections = Object.keys(resultsBySection).sort();

                for (const sectionName of sortedSections) {
                    const sectionGroup = document.createElement('div');
                    sectionGroup.className = 'search-group';
                    sectionGroup.style.marginBottom = '40px';
                    
                    sectionGroup.innerHTML = `
                        <h3 style="font-size: 1.1rem; color: var(--laranja-sunset); text-transform: uppercase; margin-bottom: 20px; border-bottom: 2px solid var(--gray-light); padding-bottom: 8px; display: inline-block;">
                            ${sectionName}
                        </h3>
                        <div class="group-content" style="display: flex; flex-direction: column; gap: 20px;"></div>
                    `;
                    
                    const contentContainer = sectionGroup.querySelector('.group-content');
                    groupsContainer.appendChild(sectionGroup);
                    
                    /* Renderiza cada item encontrado usando a estrutura padrão de resultados */
                    resultsBySection[sectionName].forEach(item => {
                        const link = isPage ? `noticia-interna.html?id=${item.id}` : `pages/noticia-interna.html?id=${item.id}`;
                        const imgSrc = `${basePath}${item.image}`;
                        
                        const resultItem = document.createElement('article');
                        resultItem.innerHTML = `
                            <a href="${link}" class="search-result-item">
                                <div class="result-img">
                                    <img src="${imgSrc}" alt="${item.title}">
                                </div>
                                <div class="result-content">
                                    <span class="card-category" style="display: block; margin-bottom: 5px;">${item.category}</span>
                                    <h3 style="margin: 0 0 8px 0; color: var(--charcoal); line-height: 1.3;">${item.title}</h3>
                                    <p style="font-size: 0.95rem; color: #555; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${item.subtitle}</p>
                                </div>
                            </a>
                        `;
                        contentContainer.appendChild(resultItem);
                    });
                }
                
                noResultsMsg.style.display = 'none';
                searchTitle.style.display = 'block';
            } else {
                /* Gerencia a exibição da mensagem de "sem resultados" */
                noResultsMsg.style.display = 'block';
                termDisplay.textContent = searchTerm;
                searchTitle.style.display = 'none';
            }

        } catch (error) {
            console.error('Erro na busca global:', error);
            noResultsMsg.style.display = 'block';
            termDisplay.textContent = searchTerm;
        }
    };

    /* Adiciona o evento de 'keydown' para busca ao apertar Enter */
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
    });

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


