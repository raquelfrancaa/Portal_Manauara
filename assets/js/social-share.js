/**
 * assets/js/social-share.js
 * Lógica para compartilhamento social dinâmico.
 */

document.addEventListener('DOMContentLoaded', () => {
    createSocialShareButtons();
});

function createSocialShareButtons() {
    // Container principal
    const container = document.createElement('div');
    container.className = 'social-share-floating';

    // Dados da página
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);

    // Configuração dos botões
    const buttons = [
        {
            class: 'whatsapp',
            icon: 'https://img.icons8.com/?size=100&id=16713&format=png&color=000000',
            label: 'WhatsApp',
            href: `https://api.whatsapp.com/send?text=${title}%20${url}`
        },
        {
            class: 'facebook',
            icon: 'https://img.icons8.com/?size=100&id=uLWV5A9vXIPu&format=png&color=000000',
            label: 'Facebook',
            href: `https://www.facebook.com`
        },
        {
            class: 'twitter',
            icon: 'https://img.icons8.com/?size=100&id=L5LOu2UuSZnG&format=png&color=ffffff',
            label: 'Twitter',
            href: `https://x.com`
        },
        {
            class: 'instagram',
            icon: 'https://img.icons8.com/?size=100&id=TRVfmt9zm5vL&format=png&color=ffffff',
            label: 'Instagram',
            href: `https://www.instagram.com` // Instagram não possui link direto de compartilhamento via URL
        },
        {
            class: 'copy',
            icon: 'https://img.icons8.com/?size=100&id=hTXAAOVVwgkC&format=png&color=000000',
            label: 'Copiar Link',
            action: () => {
                navigator.clipboard.writeText(window.location.href).then(() => {
                    alert('Link copiado para a área de transferência!');
                });
            }
        }
    ];

    buttons.forEach(btn => {
        const anchor = document.createElement('a');
        anchor.className = `share-btn ${btn.class}`;
        anchor.innerHTML = `<img src="${btn.icon}" alt="${btn.label}" style="width: 24px; height: 24px;">`;
        anchor.setAttribute('aria-label', `Compartilhar no ${btn.label}`);
        anchor.title = btn.label;

        if (btn.href) {
            anchor.href = btn.href;
            anchor.target = '_blank';
        } else if (btn.action) {
            anchor.href = 'javascript:void(0)';
            anchor.addEventListener('click', btn.action);
        }

        container.appendChild(anchor);
    });

    document.body.appendChild(container);
}
