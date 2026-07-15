let activeGenre = null;

function filterCatalog() {
    let input = document.getElementById('search-bar').value.toLowerCase();
    let albums = document.getElementsByClassName('album-card');
    let visibleCount = 0;

    for (let i = 0; i < albums.length; i++) {
        let albumName = albums[i].getElementsByTagName('h2')[0].innerText.toLowerCase();
        let artist = albums[i].getElementsByTagName('h3')[0].innerText.toLowerCase();
        let year = albums[i].getElementsByClassName('album-year')[0].innerText.toLowerCase();
        let genres = albums[i].getElementsByClassName('genre-tags')[0].innerText.toLowerCase();

        let matchesSearch = albumName.includes(input) || artist.includes(input) || year.includes(input) || genres.includes(input);
        let matchesGenre = !activeGenre || genres.includes(activeGenre);

        if (matchesSearch && matchesGenre) {
            albums[i].style.display = '';
            visibleCount++;
        } else {
            albums[i].style.display = 'none';
        }
    }

    updateResultsUI(visibleCount, albums.length);
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

function buildGenreFilter() {
    let container = document.getElementById('genre-filter');
    if (!container) return;

    let counts = {};
    document.querySelectorAll('.genre-tags').forEach(tagEl => {
        tagEl.innerText.split(',').forEach(rawGenre => {
            let genre = rawGenre.trim();
            if (!genre) return;
            counts[genre] = (counts[genre] || 0) + 1;
        });
    });

    let topGenres = Object.keys(counts)
        .sort((a, b) => counts[b] - counts[a])
        .slice(0, 14);

    let allChip = document.createElement('button');
    allChip.type = 'button';
    allChip.className = 'genre-chip active';
    allChip.innerText = 'Todos';
    allChip.dataset.genre = '';
    container.appendChild(allChip);

    topGenres.forEach(genre => {
        let chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'genre-chip';
        chip.innerText = genre;
        chip.dataset.genre = genre.toLowerCase();
        container.appendChild(chip);
    });

    container.querySelectorAll('.genre-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            container.querySelectorAll('.genre-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            activeGenre = chip.dataset.genre || null;
            filterCatalog();
        });
    });
}

function sortCatalog() {
    let sortOption = document.getElementById('sort-options');
    let selectedValue = sortOption.value;
    let albums = Array.from(document.getElementsByClassName('album-card'));
    let catalogGrid = document.querySelector('.catalog-grid');

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
