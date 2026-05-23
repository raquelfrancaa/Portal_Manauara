/**
 * contato.js
 * Script exclusivo da página de contato para gerenciar a interação com o formulário.
 * Atualmente simula um envio de dados e fornece feedback visual ao usuário.
 */

/* Garante que o script rode apenas após o carregamento do HTML */
document.addEventListener('DOMContentLoaded', () => {
    /* Tenta encontrar o elemento do formulário de contato pelo seu ID */
    const form = document.getElementById('form-contato');

    /* Se o formulário for encontrado na página atual */
    if (form) {
        /* Adiciona um "escutador" para o evento de submissão (clique no botão de enviar) */
        form.addEventListener('submit', function(e) {
            /* Bloqueia o comportamento padrão do navegador de recarregar a página */
            e.preventDefault();
            
            /* Exibe um alerta de sucesso simulando que os dados foram processados */
            alert('Obrigado por seu contato! Sua mensagem foi enviada com sucesso (simulação).');
            
            /* Limpa todos os campos preenchidos do formulário para uma nova mensagem */
            this.reset();
        });
    }
});

