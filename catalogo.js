//BARRA DE BÚSQUEDA
function filterCatalog() {
    let input = document.getElementById('search-bar').value.toLowerCase();
    let albums = document.getElementsByClassName('album-item');
    
    for (let i = 0; i < albums.length; i++) {
        let albumName = albums[i].getElementsByTagName('h2')[0].innerText.toLowerCase();
        let artist = albums[i].getElementsByTagName('p')[0].innerText.toLowerCase();
        let year = albums[i].getElementsByTagName('p')[1].innerText.toLowerCase();
        let genres = albums[i].getElementsByClassName('genre-tags')[0].innerText.toLowerCase();
        
        if (albumName.includes(input) || artist.includes(input) || year.includes(input) || genres.includes(input)) {
            albums[i].style.display = '';
        } else {
            albums[i].style.display = 'none';
        }
    }
}

// ORDENAMIENTO
function sortCatalog() {
    let sortOption = document.getElementById('sort-options').value;
    let albums = Array.from(document.getElementsByClassName('album-item')); 
    let catalogGrid = document.getElementById('catalog-grid');

    switch (sortOption) {
        case 'year-asc':
            albums.sort((a, b) => {
                let yearA = parseInt(a.getElementsByTagName('p')[1].innerText); 
                let yearB = parseInt(b.getElementsByTagName('p')[1].innerText);
                return yearB - yearA; 
            });
            break;
        case 'year-desc':
            albums.sort((a, b) => {
                let yearA = parseInt(a.getElementsByTagName('p')[1].innerText); 
                let yearB = parseInt(b.getElementsByTagName('p')[1].innerText);
                return yearA - yearB; 
            });
            break;
        case 'artist-asc':
            albums.sort((a, b) => {
                let artistA = a.getElementsByTagName('p')[0].innerText.toLowerCase();
                let artistB = b.getElementsByTagName('p')[0].innerText.toLowerCase();
                return artistA.localeCompare(artistB);
            });
            break;
        case 'artist-desc':
            albums.sort((a, b) => {
                let artistA = a.getElementsByTagName('p')[0].innerText.toLowerCase();
                let artistB = b.getElementsByTagName('p')[0].innerText.toLowerCase();
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
        default:
            return; 
    }

    catalogGrid.innerHTML = '';
    albums.forEach(album => catalogGrid.appendChild(album));
}
