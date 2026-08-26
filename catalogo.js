/* ANALYTICS */

// Envía un evento a GA4
function track(eventName, params) {
    if (typeof gtag !== 'function') return;
    try {
        gtag('event', eventName, params || {});
    } catch (e) {
        // si hay adblock no pasa nada
    }
}

// Recorta strings al límite de GA4
function clip(str) {
    return String(str || '').trim().slice(0, 100);
}

// Búsqueda con debounce (solo un evento por búsqueda)
let searchTimer = null;
let lastSearchSent = '';

function trackSearch(term, visibleCount) {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        const clean = term.trim().toLowerCase();
        if (clean.length < 3) return;          // ignora búsquedas de 1-2 letras
        if (clean === lastSearchSent) return;  // no repetir la misma
        lastSearchSent = clean;

        track('catalog_search', {
            search_term: clip(clean),
            results_count: visibleCount,
            has_results: visibleCount > 0 ? 'si' : 'no'
        });
    }, 1000); // espera 1 segundo de inactividad
}

let activeGenre = null;

function filterCatalog(source) {
    let input = document.getElementById('search-bar').value.toLowerCase();
    let albums = document.getElementsByClassName('album-card');
    let visibleCount = 0;

    for (let i = 0; i < albums.length; i++) {
        let albumName = albums[i].getElementsByTagName('h2')[0].innerText.toLowerCase();
        let artist = albums[i].getElementsByTagName('h3')[0].innerText.toLowerCase();
        let year = albums[i].getElementsByClassName('album-year')[0].innerText.toLowerCase();
        let genres = albums[i].getElementsByClassName('genre-tags')[0].innerText.toLowerCase();

        let matchesSearch = albumName.includes(input) || artist.includes(input) || year.includes(input) || genres.includes(input);
        let categoria = albums[i].dataset.categoria || 'Otros';
        let matchesGenre = !activeGenre || categoria === activeGenre;

        if (matchesSearch && matchesGenre) {
            albums[i].style.display = '';
            visibleCount++;
        } else {
            albums[i].style.display = 'none';
        }
    }

    updateResultsUI(visibleCount, albums.length);

    if (source === 'search') {
        trackSearch(input, visibleCount);
    }
    return visibleCount;
}

function updateResultsUI(visibleCount, total) {
    let resultsCount = document.getElementById('results-count');
    let noResults = document.getElementById('no-results');

    if (resultsCount) {
        resultsCount.innerText = visibleCount === total
            ? `${total} discos`
            : `${visibleCount} de ${total} discos`;
    }

    if (noResults) {
        noResults.classList.toggle('show', visibleCount === 0);
    }
}

// Orden fijo e intencional. No lo generamos por frecuencia:
// queremos que los chips no se muevan de lugar entre visitas,
// y que el orden refleje la identidad del catálogo.
const CATEGORIAS = [
    'Rock',
    'Cantautor y Folk',
    'Latino y Tropical',
    'Jazz',
    'Hip Hop',
    'Soul, Funk y R&B',
    'Pop',
    'Clásica y Soundtrack',
    'Electrónica',
    'Otros'
];

function buildGenreFilter() {
    let container = document.getElementById('genre-filter');
    if (!container) return;

    // Cuenta cuántos discos hay realmente en cada categoría
    let counts = {};
    document.querySelectorAll('.album-card').forEach(card => {
        let cat = card.dataset.categoria || 'Otros';
        counts[cat] = (counts[cat] || 0) + 1;
    });

    let total = document.getElementsByClassName('album-card').length;

    let allChip = document.createElement('button');
    allChip.type = 'button';
    allChip.className = 'genre-chip active';
    allChip.innerText = `Todos (${total})`;
    allChip.dataset.categoria = '';
    container.appendChild(allChip);

    CATEGORIAS.forEach(cat => {
        if (!counts[cat]) return;   // no dibujar chips vacíos
        let chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'genre-chip';
        chip.innerText = `${cat} (${counts[cat]})`;
        chip.dataset.categoria = cat;
        container.appendChild(chip);
    });

    container.querySelectorAll('.genre-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            container.querySelectorAll('.genre-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            activeGenre = chip.dataset.categoria || null;
            let visibles = filterCatalog('genre');

            track('genre_filter', {
                genre_name: clip(chip.dataset.categoria || 'Todos'),
                results_count: visibles
            });
        });
    });
}

function sortCatalog() {
    let sortOption = document.getElementById('sort-options');
    let selectedValue = sortOption.value;
    let albums = Array.from(document.getElementsByClassName('album-card'));
    let catalogGrid = document.querySelector('.catalog-grid');

    if (selectedValue && selectedValue !== 'default') {
        track('catalog_sort', { sort_option: clip(selectedValue) });
    }

    switch (selectedValue) {
        case 'year-asc':
            albums.sort((a, b) => {
                let yearA = parseInt(a.getElementsByClassName('album-year')[0].innerText);
                let yearB = parseInt(b.getElementsByClassName('album-year')[0].innerText);
                return yearA - yearB;
            });
            break;
        case 'year-desc':
            albums.sort((a, b) => {
                let yearA = parseInt(a.getElementsByClassName('album-year')[0].innerText);
                let yearB = parseInt(b.getElementsByClassName('album-year')[0].innerText);
                return yearB - yearA;
            });
            break;
        case 'artist-asc':
            albums.sort((a, b) => {
                let artistA = a.getElementsByTagName('h3')[0].innerText.toLowerCase();
                let artistB = b.getElementsByTagName('h3')[0].innerText.toLowerCase();
                return artistA.localeCompare(artistB);
            });
            break;
        case 'artist-desc':
            albums.sort((a, b) => {
                let artistA = a.getElementsByTagName('h3')[0].innerText.toLowerCase();
                let artistB = b.getElementsByTagName('h3')[0].innerText.toLowerCase();
                return artistB.localeCompare(artistA);
            });
            break;
        case 'title-asc':
            albums.sort((a, b) => {
                let titleA = a.getElementsByTagName('h2')[0].innerText.toLowerCase();
                let titleB = b.getElementsByTagName('h2')[0].innerText.toLowerCase();
                return titleA.localeCompare(titleB);
            });
            break;
        case 'title-desc':
            albums.sort((a, b) => {
                let titleA = a.getElementsByTagName('h2')[0].innerText.toLowerCase();
                let titleB = b.getElementsByTagName('h2')[0].innerText.toLowerCase();
                return titleB.localeCompare(titleA);
            });
            break;
        case 'random':
            albums.sort(() => Math.random() - 0.5);
            sortOption.selectedIndex = 0;
            break;
        default:
            return;
    }

    catalogGrid.innerHTML = '';
    albums.forEach(album => catalogGrid.appendChild(album));
}


const popup = document.getElementById('album-popup');
const popupCover = document.getElementById('popup-cover');
const popupTitle = document.getElementById('popup-title');
const popupArtist = document.getElementById('popup-artist');
const popupYear = document.getElementById('popup-year');
const popupGenres = document.getElementById('popup-genres');
const closePopup = document.querySelector('.close-popup');


function openPopup(event) {
    let albumCard = event.currentTarget;

    let coverSrc = albumCard.querySelector('.album-cover').src;
    let title = albumCard.querySelector('h2').innerText;
    let artist = albumCard.querySelector('h3').innerText;
    let year = albumCard.querySelector('.album-year').innerText;
    let genres = albumCard.querySelector('.genre-tags').innerText;

    popupCover.src = coverSrc;
    popupTitle.innerText = title;
    popupArtist.innerText = artist;
    popupYear.innerText = `📅 Año: ${year}`;
    popupGenres.innerText = `🎵 Géneros: ${genres}`;

    popup.classList.add('visible');

    track('album_view', {
        album_title: clip(title),
        album_artist: clip(artist),
        album_year: clip(year),
        album_genres: clip(genres),
        album_category: clip(albumCard.dataset.categoria || 'Otros'),
    });
}

closePopup.addEventListener('click', () => {
    popup.classList.remove('visible');
});

popup.addEventListener('click', (event) => {
    if (event.target === popup) {
        popup.classList.remove('visible');
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        popup.classList.remove('visible');
    }
});

document.querySelectorAll('.album-card').forEach(album => {
    album.addEventListener('click', openPopup);
    album.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openPopup(event);
        }
    });
});

const backToTop = document.getElementById('back-to-top');
if (backToTop) {
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('show', window.scrollY > 500);
    });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

buildGenreFilter();
let totalAlbums = document.getElementsByClassName('album-card').length;
updateResultsUI(totalAlbums, totalAlbums);

// --- Profundidad de scroll: 25 / 50 / 75 / 100 % ---
const depthsSent = {};
window.addEventListener('scroll', () => {
    const doc = document.documentElement;
    const alcance = doc.scrollHeight - window.innerHeight;
    if (alcance <= 0) return;

    const pct = (window.scrollY / alcance) * 100;

    [25, 50, 75, 100].forEach(hito => {
        if (pct >= hito && !depthsSent[hito]) {
            depthsSent[hito] = true;
            track('catalog_scroll', { percent_scrolled: hito });
        }
    });
}, { passive: true });