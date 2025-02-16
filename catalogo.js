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

// 🔽 ORDENAMIENTO (Sorting)
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
                return yearA - yearB; // Ascending
            });
            break;
        case 'year-desc':
            albums.sort((a, b) => {
                let yearA = parseInt(a.getElementsByClassName('album-year')[0].innerText);
                let yearB = parseInt(b.getElementsByClassName('album-year')[0].innerText);
                return yearB - yearA; // Descending
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
        case 'random': // 🎲 Force reshuffle every time it's selected
            albums.sort(() => Math.random() - 0.5);
            
            // Reset selection to allow re-selection of "Random"
            sortOption.selectedIndex = 0;
            break;
        default:
            return;
    }

    // Reorder the albums inside the grid
    catalogGrid.innerHTML = '';
    albums.forEach(album => catalogGrid.appendChild(album));
}
