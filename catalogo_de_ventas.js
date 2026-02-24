
function filterCatalog() {
    const input = document.getElementById('search-bar').value.toLowerCase();
    const albums = document.getElementsByClassName('album-card');

    for (let i = 0; i < albums.length; i++) {
        const album = albums[i];
        const name = album.querySelector('h2').innerText.toLowerCase();
        const artist = album.querySelector('h3').innerText.toLowerCase();
        const genre = album.querySelector('.genre-tags').innerText.toLowerCase();
        const country = album.querySelector('p:nth-of-type(2)').innerText.toLowerCase();
        const label = album.querySelector('p:nth-of-type(3)').innerText.toLowerCase();

        const match = name.includes(input) || artist.includes(input) || genre.includes(input) || country.includes(input) || label.includes(input);
        album.style.display = match ? '' : 'none';
    }
}


function sortCatalog() {
    let sortOption = document.getElementById('sort-options');
    let selectedValue = sortOption.value;
    let albums = Array.from(document.getElementsByClassName('album-card')); 
    let catalogGrid = document.querySelector('.catalog-grid');

    switch (selectedValue) {
        case 'price-asc':
            albums.sort((a, b) => {
                let priceA = parseFloat(a.getElementsByClassName('album-price')[0].innerText.replace(/[^0-9.]/g, '')) || 0;
                let priceB = parseFloat(b.getElementsByClassName('album-price')[0].innerText.replace(/[^0-9.]/g, '')) || 0;
                return priceA - priceB;
            });
            break;
        case 'price-desc':
            albums.sort((a, b) => {
                let priceA = parseFloat(a.getElementsByClassName('album-price')[0].innerText.replace(/[^0-9.]/g, '')) || 0;
                let priceB = parseFloat(b.getElementsByClassName('album-price')[0].innerText.replace(/[^0-9.]/g, '')) || 0;
                return priceB - priceA;
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
const popupGenres = document.getElementById('popup-genres');
const popupCountry = document.getElementById('popup-country');
const popupLabel = document.getElementById('popup-label');
const popupCatalog = document.getElementById('popup-catalog');
const popupPrice = document.getElementById('popup-price');
const closePopup = document.querySelector('.close-popup');

function openPopup(event) {
    let albumCard = event.currentTarget;

    let coverSrc = albumCard.querySelector('.album-cover').src;
    let title = albumCard.querySelector('h2').innerText;
    let artist = albumCard.querySelector('h3').innerText;
    let genres = albumCard.querySelector('.genre-tags').innerText;
    let country = albumCard.querySelector('p:nth-of-type(2)').innerText.replace("País de edición:", "").trim();
    let label = albumCard.querySelector('p:nth-of-type(3)').innerText.replace("Sello discográfico:", "").trim();
    let catalog = albumCard.querySelector('p:nth-of-type(4)').innerText.replace("Número de catálogo:", "").trim();
    let price = albumCard.querySelector('.album-price').innerText;

    popupCover.src = coverSrc;
    popupTitle.innerText = title;
    popupArtist.innerText = artist;
    popupGenres.innerText = `🎵 Género: ${genres}`;
    popupCountry.innerText = `🌍  ${country}`;
    popupLabel.innerText = `🏷️  ${label}`;
    popupCatalog.innerText = `📦  ${catalog}`;
    popupPrice.innerText = `💰  ${price}`;

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
