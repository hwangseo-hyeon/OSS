function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function simplifyMovieCards() {
    document.querySelectorAll('.movie-grid .movie-card').forEach((card) => {
        const img = card.querySelector('.movie-poster img');
        const titleEl = card.querySelector('h2.title, .title');
        const synopsisEl = card.querySelector('.synopsis');
        if (!img || !titleEl) return;

        const title = titleEl.textContent.trim();
        const posterSrc = img.getAttribute('src');
        const posterAlt = img.getAttribute('alt') || title;
        const synopsis = synopsisEl
            ? synopsisEl.textContent.replace(/\s+/g, ' ').trim()
            : '';
        const id = card.dataset.id || title;
        const price = parseInt(card.dataset.price, 10) || 14000;

        card.classList.add('movie-card--simple');
        card.innerHTML = `
            <div class="movie-poster">
                <img src="${posterSrc}" alt="${escapeHtml(posterAlt)}">
            </div>
            <h2 class="movie-title">${escapeHtml(title)}</h2>
            <button type="button" class="btn-book">예매하기</button>
        `;

        card.querySelector('.btn-book').addEventListener('click', () => {
            openMovieModal({
                id,
                title,
                price,
                posterSrc,
                synopsis,
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    injectMovieModal();
    simplifyMovieCards();

    const grid = document.querySelector('.movie-grid');
    if (grid) grid.classList.add('movies-ready');

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMovieModal();
    });
});
