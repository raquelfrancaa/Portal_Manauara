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

/* Implementa a lógica de busca funcional (filtro de cards) */
function initSearch() {
    /* Seleciona o campo de entrada de texto e o botão de busca */
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    /* Se o campo de busca não existir na página atual, interrompe a execução */
    if (!searchInput) return;

    /* Função interna que executa a filtragem dos elementos */
    const performSearch = () => {
        /* Normaliza o termo de busca: minúsculas e sem espaços extras */
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        /* Seleciona todos os tipos de cards que podem ser filtrados no portal */
        const cards = document.querySelectorAll('.news-card, .agenda-card, .article-item-cat, .featured-article-cat');

        cards.forEach(card => {
            /* Captura todo o texto contido no card para comparação */
            const cardText = card.textContent.toLowerCase();
            
            /* Se o termo de busca estiver presente no texto do card (ou se a busca estiver vazia) */
            if (cardText.includes(searchTerm)) {
                /* Exibe o card. Se for da agenda, usa flex para manter o layout */
                card.style.display = card.classList.contains('agenda-card') ? 'flex' : 'block';
            } else {
                /* Esconde o card que não corresponde à busca */
                card.style.display = 'none';
            }
        });
    };

    /* Adiciona o evento de 'input' para busca em tempo real conforme o usuário digita */
    searchInput.addEventListener('input', performSearch);

    /* Adiciona o evento de clique no botão de lupa, caso ele exista */
    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Evita comportamentos padrão de botões em forms
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


