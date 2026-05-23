/**
 * menu.js
 * Gerencia o comportamento do menu de navegação em dispositivos móveis (Mobile).
 * Permite abrir e fechar o menu hambúrguer com interatividade e acessibilidade.
 */

/* Aguarda o carregamento completo do DOM (Estrutura da página) */
document.addEventListener('DOMContentLoaded', () => {
    /* Seleciona o botão de alternância do menu (as 3 barrinhas) */
    const mobileToggle = document.querySelector('.mobile-toggle');
    /* Seleciona a lista de links do menu que será exibida/escondida */
    const navMenu = document.querySelector('.nav-menu');

    /* Verifica se ambos os elementos existem na página atual para evitar erros */
    if (mobileToggle && navMenu) {
        /* Adiciona um evento de clique no botão do menu mobile */
        mobileToggle.addEventListener('click', () => {
            /* Alterna a classe 'active' no menu. Se tiver, remove. Se não tiver, adiciona. */
            /* Essa classe controla a visibilidade do menu no CSS (header.css) */
            navMenu.classList.toggle('active');
            
            /* Alterna a classe 'open' no botão (útil para animações de transformação das barrinhas) */
            mobileToggle.classList.toggle('open');
            
            /* --- Gerenciamento de Acessibilidade (ARIA) --- */
            /* Verifica se o menu já está expandido consultando o atributo aria-expanded */
            const expanded = mobileToggle.getAttribute('aria-expanded') === 'true' || false;
            /* Inverte o estado: se estava verdadeiro, vira falso e vice-versa */
            /* Isso ajuda tecnologias assistivas (leitores de tela) a entenderem o estado do menu */
            mobileToggle.setAttribute('aria-expanded', !expanded);
        });
    }
});

