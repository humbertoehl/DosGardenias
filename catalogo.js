function filterCatalog() {
    let input = document.getElementById('search-bar').value.toLowerCase();
    let albums = document.getElementsByClassName('album-card');

    for (let i = 0; i < albums.length; i++) {
        let albumName = albums[i].getElementsByTagName('h2')[0].innerText.toLowerCase();
        let artist = albums[i].getElementsByTagName('h3')[0].innerText.toLowerCase();
        let year = albums[i].getElementsByClassName('album-year')[0].innerText.toLowerCase();
        let genres = albums[i].getElementsByClassName('genre-tags')[0].innerText.toLowerCase();

        if (albumName.includes(input) || artist.includes(input) || year.includes(input) || genres.includes(input)) {
            albums[i].style.display = '';
        } else {
            albums[i].style.display = 'none';
        }
    }
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

document.querySelectorAll('.album-card').forEach(album => {
    album.addEventListener('click', openPopup);
});